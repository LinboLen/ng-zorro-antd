/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  booleanAttribute,
  inject,
  numberAttribute
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { TriButtonType } from 'ng-zorro-antd/button';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriModalContentDirective } from './modal-content.directive';
import { TriModalFooterDirective } from './modal-footer.directive';
import { TriModalLegacyAPI } from './modal-legacy-api';
import { TriModalRef } from './modal-ref';
import { TriModalTitleDirective } from './modal-title.directive';
import { ModalButtonOptions, ModalOptions, ModalTypes, OnClickCallback, StyleObjectLike } from './modal-types';
import { TriModalService } from './modal.service';
import { getConfigFromComponent } from './utils';

@Component({
  selector: '',
  exportAs: 'triModal',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriModalComponent<T extends ModalOptions = TriSafeAny, R = TriSafeAny>
  implements OnChanges, TriModalLegacyAPI<T, R>
{
  private cdr = inject(ChangeDetectorRef);
  private modal = inject(TriModalService);
  private viewContainerRef = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);

  @Input({ transform: booleanAttribute }) mask?: boolean;
  @Input({ transform: booleanAttribute }) maskClosable?: boolean;
  @Input({ transform: booleanAttribute }) closeOnNavigation?: boolean;
  @Input({ transform: booleanAttribute }) visible: boolean = false;
  @Input({ transform: booleanAttribute }) closable: boolean = true;
  @Input({ transform: booleanAttribute }) okLoading: boolean = false;
  @Input({ transform: booleanAttribute }) okDisabled: boolean = false;
  @Input({ transform: booleanAttribute }) cancelDisabled: boolean = false;
  @Input({ transform: booleanAttribute }) cancelLoading: boolean = false;
  @Input({ transform: booleanAttribute }) keyboard: boolean = true;
  @Input({ transform: booleanAttribute }) noAnimation = false;
  @Input({ transform: booleanAttribute }) centered = false;
  @Input({ transform: booleanAttribute }) draggable = false;
  @Input() content?: string | TemplateRef<{}> | Type<T>;
  @Input() footer?: string | TemplateRef<{}> | Array<ModalButtonOptions<T>> | null;
  @Input({ transform: numberAttribute }) zIndex: number = 1000;
  @Input() width: number | string = 520;
  @Input() wrapClassName?: string;
  @Input() className?: string;
  @Input() style?: object;
  @Input() title?: string | TemplateRef<{}>;
  @Input() closeIcon: string | TemplateRef<void> = 'close';
  @Input() maskStyle?: StyleObjectLike;
  @Input() bodyStyle?: StyleObjectLike;
  @Input() okText?: string | null;
  @Input() cancelText?: string | null;
  @Input() okType: TriButtonType = 'primary';
  @Input({ transform: booleanAttribute }) okDanger: boolean = false;
  @Input() iconType: string = 'question-circle'; // Confirm Modal ONLY
  @Input() modalType: ModalTypes = 'default';
  @Input() autofocus: 'ok' | 'cancel' | 'auto' | null = 'auto';

  // TODO(@hsuanxyz) Input will not be supported
  @Input()
  @Output()
  readonly onOk: EventEmitter<T> | OnClickCallback<T> | TriSafeAny = new EventEmitter<T>();

  // TODO(@hsuanxyz) Input will not be supported
  @Input()
  @Output()
  readonly onCancel: EventEmitter<T> | OnClickCallback<T> | TriSafeAny = new EventEmitter<T>();

  @Output() readonly afterOpen = new EventEmitter<void>();
  @Output() readonly afterClose = new EventEmitter<R>();
  @Output() readonly visibleChange = new EventEmitter<boolean>();

  @ContentChild(TriModalTitleDirective, { static: true, read: TemplateRef })
  set modalTitle(value: TemplateRef<TriSafeAny>) {
    if (value) {
      this.setTitleWithTemplate(value);
    }
  }

  @ContentChild(TriModalContentDirective, { static: true, read: TemplateRef })
  contentFromContentChild!: TemplateRef<TriSafeAny>;

  @ContentChild(TriModalFooterDirective, { static: true, read: TemplateRef })
  set modalFooter(value: TemplateRef<TriSafeAny>) {
    if (value) {
      this.setFooterWithTemplate(value);
    }
  }

  private modalRef: TriModalRef | null = null;

  get _afterOpen(): Observable<void> {
    // Observable alias for nzAfterOpen
    return this.afterOpen.asObservable();
  }

  get _afterClose(): Observable<R> {
    // Observable alias for nzAfterClose
    return this.afterClose.asObservable();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.modalRef?._finishDialogClose();
    });
  }

  open(): void {
    if (!this.visible) {
      this.visible = true;
      this.visibleChange.emit(true);
    }

    if (!this.modalRef) {
      const config = this.getConfig();
      this.modalRef = this.modal.create(config);

      // When the modal is implicitly closed (e.g. closeAll) the nzVisible needs to be set to the correct value and emit.
      this.modalRef._afterClose
        .asObservable()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.close();
        });
    }
  }

  close(result?: R): void {
    if (this.visible) {
      this.visible = false;
      this.visibleChange.emit(false);
    }

    if (this.modalRef) {
      this.modalRef.close(result);
      this.modalRef = null;
    }
  }

  destroy(result?: R): void {
    this.close(result);
  }

  triggerOk(): void {
    this.modalRef?.triggerOk();
  }

  triggerCancel(): void {
    this.modalRef?.triggerCancel();
  }

  getContentComponent(): T | void {
    return this.modalRef?.getContentComponent();
  }

  getElement(): HTMLElement | void {
    return this.modalRef?.getElement();
  }

  getModalRef(): TriModalRef | null {
    return this.modalRef;
  }

  private setTitleWithTemplate(templateRef: TemplateRef<{}>): void {
    this.title = templateRef;
    if (this.modalRef) {
      // If modalRef already created, set the title in next tick
      Promise.resolve().then(() => {
        this.modalRef!.updateConfig({
          title: this.title
        });
      });
    }
  }

  private setFooterWithTemplate(templateRef: TemplateRef<{}>): void {
    this.footer = templateRef;
    if (this.modalRef) {
      // If modalRef already created, set the footer in next tick
      Promise.resolve().then(() => {
        this.modalRef!.updateConfig({
          footer: this.footer
        });
      });
    }

    this.cdr.markForCheck();
  }

  private getConfig(): ModalOptions {
    const componentConfig = getConfigFromComponent(this);
    componentConfig.viewContainerRef = this.viewContainerRef;
    componentConfig.content = this.content || this.contentFromContentChild;
    return componentConfig;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzVisible, ...otherChanges } = changes;

    if (Object.keys(otherChanges).length && this.modalRef) {
      this.modalRef.updateConfig(getConfigFromComponent(this));
    }

    if (nzVisible) {
      if (this.visible) {
        this.open();
      } else {
        this.close();
      }
    }
  }
}
