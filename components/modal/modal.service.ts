/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  ComponentType,
  OverlayRef,
  createBlockScrollStrategy,
  createGlobalPositionStrategy,
  createOverlayRef
} from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, Injector, OnDestroy, TemplateRef, inject } from '@angular/core';
import { Observable, Subject, defer } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { TriConfigService } from 'ng-zorro-antd/core/config';
import { warn } from 'ng-zorro-antd/core/logger';
import { overlayZIndexSetter } from 'ng-zorro-antd/core/overlay';
import { IndexableObject, TriSafeAny } from 'ng-zorro-antd/core/types';
import { isNotNil } from 'ng-zorro-antd/core/util';

import { MODAL_MASK_CLASS_NAME, TRI_CONFIG_MODULE_NAME, TRI_MODAL_DATA } from './modal-config';
import { TriModalConfirmContainerComponent } from './modal-confirm-container.component';
import { TriModalContainerComponent } from './modal-container.component';
import { BaseModalContainerComponent } from './modal-container.directive';
import { TriModalRef } from './modal-ref';
import { ConfirmType, ModalOptions } from './modal-types';
import { applyConfigDefaults, getValueWithConfig } from './utils';

type ContentType<T> = ComponentType<T> | TemplateRef<T> | string;

@Injectable()
export class TriModalService implements OnDestroy {
  private injector = inject(Injector);
  private configService = inject(TriConfigService);
  private directionality = inject(Directionality);
  private parentModal = inject(TriModalService, { skipSelf: true, optional: true });

  private openModalsAtThisLevel: TriModalRef[] = [];
  private readonly afterAllClosedAtThisLevel = new Subject<void>();

  get openModals(): TriModalRef[] {
    return this.parentModal ? this.parentModal.openModals : this.openModalsAtThisLevel;
  }

  get _afterAllClosed(): Subject<void> {
    const parent = this.parentModal;
    return parent ? parent._afterAllClosed : this.afterAllClosedAtThisLevel;
  }

  readonly afterAllClose: Observable<void> = defer(() =>
    this.openModals.length ? this._afterAllClosed : this._afterAllClosed.pipe(startWith(undefined))
  ) as Observable<void>;

  create<T, D = TriSafeAny, R = TriSafeAny>(config: ModalOptions<T, D, R>): TriModalRef<T, R> {
    return this.open<T, D, R>(config.content as ComponentType<T>, config);
  }

  closeAll(): void {
    this.closeModals(this.openModals);
  }

  confirm<T>(options: ModalOptions<T> = {}, confirmType: ConfirmType = 'confirm'): TriModalRef<T> {
    if ('nzFooter' in options) {
      warn(`The Confirm-Modal doesn't support "nzFooter", this property will be ignored.`);
    }
    if (!('nzWidth' in options)) {
      options.width = 416;
    }
    if (!('nzMaskClosable' in options)) {
      options.maskClosable = false;
    }

    options.modalType = 'confirm';
    options.className = `ant-modal-confirm ant-modal-confirm-${confirmType} ${options.className || ''}`;
    return this.create(options);
  }

  info<T>(options: ModalOptions<T> = {}): TriModalRef<T> {
    return this.confirmFactory(options, 'info');
  }

  success<T>(options: ModalOptions<T> = {}): TriModalRef<T> {
    return this.confirmFactory(options, 'success');
  }

  error<T>(options: ModalOptions<T> = {}): TriModalRef<T> {
    return this.confirmFactory(options, 'error');
  }

  warning<T>(options: ModalOptions<T> = {}): TriModalRef<T> {
    return this.confirmFactory(options, 'warning');
  }

  private open<T, D, R>(componentOrTemplateRef: ContentType<T>, config?: ModalOptions<T, D, R>): TriModalRef<T, R> {
    const configMerged = applyConfigDefaults(config || {}, new ModalOptions());
    const overlayRef = this.createOverlay(configMerged);
    const modalContainer = this.attachModalContainer(overlayRef, configMerged);
    const modalRef = this.attachModalContent<T, D, R>(componentOrTemplateRef, modalContainer, overlayRef, configMerged);
    modalContainer.modalRef = modalRef;

    overlayZIndexSetter(overlayRef, config?.zIndex);

    this.openModals.push(modalRef);
    modalRef._afterClose.subscribe(() => this.removeOpenModal(modalRef));

    return modalRef;
  }

  private removeOpenModal(modalRef: TriModalRef): void {
    const index = this.openModals.indexOf(modalRef);
    if (index > -1) {
      this.openModals.splice(index, 1);

      if (!this.openModals.length) {
        this._afterAllClosed.next();
      }
    }
  }

  private closeModals(dialogs: TriModalRef[]): void {
    let i = dialogs.length;
    while (i--) {
      dialogs[i].close();
      if (!this.openModals.length) {
        this._afterAllClosed.next();
      }
    }
  }

  private createOverlay(config: ModalOptions): OverlayRef {
    const globalConfig: TriSafeAny = this.configService.getConfigForComponent(TRI_CONFIG_MODULE_NAME) || {};

    return createOverlayRef(this.injector, {
      hasBackdrop: true,
      scrollStrategy: createBlockScrollStrategy(this.injector),
      backdropClass: getValueWithConfig(config.mask, globalConfig.nzMask, true) ? MODAL_MASK_CLASS_NAME : '',
      positionStrategy: createGlobalPositionStrategy(this.injector),
      disposeOnNavigation: getValueWithConfig(config.closeOnNavigation, globalConfig.nzCloseOnNavigation, true),
      direction: getValueWithConfig(config.direction, globalConfig.nzDirection, this.directionality.value)
    });
  }

  private attachModalContainer(overlayRef: OverlayRef, config: ModalOptions): BaseModalContainerComponent {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this.injector,
      providers: [
        { provide: OverlayRef, useValue: overlayRef },
        { provide: ModalOptions, useValue: config }
      ]
    });

    const ContainerComponent =
      config.modalType === 'confirm'
        ? // If the mode is `confirm`, use `NzModalConfirmContainerComponent`
          TriModalConfirmContainerComponent
        : // If the mode is not `confirm`, use `NzModalContainerComponent`
          TriModalContainerComponent;

    const containerPortal = new ComponentPortal<BaseModalContainerComponent>(
      ContainerComponent,
      config.viewContainerRef,
      injector
    );
    const containerRef = overlayRef.attach<BaseModalContainerComponent>(containerPortal);

    return containerRef.instance;
  }

  private attachModalContent<T, D, R>(
    componentOrTemplateRef: ContentType<T>,
    modalContainer: BaseModalContainerComponent,
    overlayRef: OverlayRef,
    config: ModalOptions<T>
  ): TriModalRef<T, R> {
    const modalRef = new TriModalRef<T, R>(overlayRef, config, modalContainer);

    if (componentOrTemplateRef instanceof TemplateRef) {
      modalContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          $implicit: config.data,
          modalRef
        } as TriSafeAny)
      );
    } else if (isNotNil(componentOrTemplateRef) && typeof componentOrTemplateRef !== 'string') {
      const injector = this.createInjector<T, D, R>(modalRef, config);
      const contentRef = modalContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector)
      );
      modalRef.componentRef = contentRef;
      modalRef.componentInstance = contentRef.instance;
    } else {
      modalContainer.attachStringContent();
    }
    return modalRef;
  }

  private createInjector<T, D, R>(modalRef: TriModalRef<T, R>, config: ModalOptions<T, D, R>): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    return Injector.create({
      parent: userInjector || this.injector,
      providers: [
        { provide: TriModalRef, useValue: modalRef },
        { provide: TRI_MODAL_DATA, useValue: config.data }
      ]
    });
  }

  private confirmFactory<T>(options: ModalOptions<T> = {}, confirmType: ConfirmType): TriModalRef<T> {
    const iconMap: IndexableObject = {
      info: 'info-circle',
      success: 'check-circle',
      error: 'close-circle',
      warning: 'exclamation-circle'
    };
    if (!('nzIconType' in options)) {
      options.iconType = iconMap[confirmType];
    }
    if (!('nzCancelText' in options)) {
      // Remove the Cancel button if the user not specify a Cancel button
      options.cancelText = null;
    }
    return this.confirm(options, confirmType);
  }

  ngOnDestroy(): void {
    this.closeModals(this.openModalsAtThisLevel);
    this.afterAllClosedAtThisLevel.complete();
  }
}
