/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { isPromise } from 'ng-zorro-antd/core/util';

import { BaseModalContainerComponent } from './modal-container.directive';
import { TriModalLegacyAPI } from './modal-legacy-api';
import { ModalOptions } from './modal-types';

export const TriModalState = {
  OPEN: 0,
  CLOSING: 1,
  CLOSED: 2
} as const;

export type TriModalState = (typeof TriModalState)[keyof typeof TriModalState];

export const TriTriggerAction = {
  CANCEL: 'cancel',
  OK: 'ok'
} as const;

export type TriTriggerAction = (typeof TriTriggerAction)[keyof typeof TriTriggerAction];

export class TriModalRef<T = TriSafeAny, R = TriSafeAny> implements TriModalLegacyAPI<T, R> {
  componentInstance: T | null = null;
  componentRef: ComponentRef<T> | null = null;
  result?: R;
  state: TriModalState = TriModalState.OPEN;
  _afterClose = new Subject<R | undefined>();
  _afterOpen = new Subject<void>();

  private closeTimeout?: ReturnType<typeof setTimeout>;

  private destroy$ = new Subject<void>();

  constructor(
    private overlayRef: OverlayRef,
    private config: ModalOptions,
    public containerInstance: BaseModalContainerComponent
  ) {
    containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'enter'),
        take(1)
      )
      .subscribe(() => {
        this._afterOpen.next();
        this._afterOpen.complete();
        if (config.afterOpen instanceof EventEmitter) {
          config.afterOpen.emit();
        }
      });

    containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'exit'),
        take(1)
      )
      .subscribe(() => {
        clearTimeout(this.closeTimeout);
        this._finishDialogClose();
      });

    containerInstance.containerClick.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const cancelable = !this.config.cancelLoading && !this.config.okLoading;
      if (cancelable) {
        this.trigger(TriTriggerAction.CANCEL);
      }
    });

    overlayRef
      .keydownEvents()
      .pipe(
        filter(
          event =>
            (this.config.keyboard as boolean) &&
            !this.config.cancelLoading &&
            !this.config.okLoading &&
            event.keyCode === ESCAPE &&
            !hasModifierKey(event)
        )
      )
      .subscribe(event => {
        event.preventDefault();
        this.trigger(TriTriggerAction.CANCEL);
      });

    containerInstance.cancelTriggered
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.trigger(TriTriggerAction.CANCEL));

    containerInstance.okTriggered.pipe(takeUntil(this.destroy$)).subscribe(() => this.trigger(TriTriggerAction.OK));

    overlayRef.detachments().subscribe(() => {
      this._afterClose.next(this.result);
      this._afterClose.complete();
      if (config.afterClose instanceof EventEmitter) {
        config.afterClose.emit(this.result);
      }
      this.componentInstance = null;
      this.componentRef = null;
      this.overlayRef.dispose();
    });
  }

  getContentComponent(): T {
    return this.componentInstance as T;
  }

  getContentComponentRef(): Readonly<ComponentRef<T> | null> {
    return this.componentRef as Readonly<ComponentRef<T> | null>;
  }

  getElement(): HTMLElement {
    return this.containerInstance.getNativeElement();
  }

  destroy(result?: R): void {
    this.close(result);
  }

  triggerOk(): Promise<void> {
    return this.trigger(TriTriggerAction.OK);
  }

  triggerCancel(): Promise<void> {
    return this.trigger(TriTriggerAction.CANCEL);
  }

  close(result?: R): void {
    if (this.state !== TriModalState.OPEN) {
      return;
    }
    this.result = result;
    this.containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'start'),
        take(1)
      )
      .subscribe(event => {
        this.overlayRef.detachBackdrop();
        this.closeTimeout = setTimeout(() => {
          this._finishDialogClose();
        }, event.totalTime + 100);
      });

    this.containerInstance.startExitAnimation();
    this.state = TriModalState.CLOSING;
  }

  updateConfig(config: ModalOptions): void {
    Object.assign(this.config, config);
    this.containerInstance.bindBackdropStyle();
    this.containerInstance.cdr.markForCheck();
  }

  getState(): TriModalState {
    return this.state;
  }

  getConfig(): ModalOptions {
    return this.config;
  }

  getBackdropElement(): HTMLElement | null {
    return this.overlayRef.backdropElement;
  }

  private async trigger(action: TriTriggerAction): Promise<void> {
    if (this.state === TriModalState.CLOSING) {
      return;
    }
    const actionMap = {
      [TriTriggerAction.OK]: { trigger: this.config.onOk, loadingKey: 'nzOkLoading' },
      [TriTriggerAction.CANCEL]: { trigger: this.config.onCancel, loadingKey: 'nzCancelLoading' }
    } as const;
    const { trigger, loadingKey } = actionMap[action];
    if (this.config[loadingKey]) {
      return;
    }
    if (trigger instanceof EventEmitter) {
      trigger.emit(this.getContentComponent());
    } else if (typeof trigger === 'function') {
      const result = trigger(this.getContentComponent());
      if (isPromise(result)) {
        this.config[loadingKey] = true;
        let doClose: boolean | void | {} = false;
        try {
          doClose = (await result) as typeof result;
        } finally {
          this.config[loadingKey] = false;
          this.closeWhitResult(doClose);
        }
      } else {
        this.closeWhitResult(result);
      }
    }
  }

  private closeWhitResult(result: TriSafeAny): void {
    if (result !== false) {
      this.close(result);
    }
  }

  _finishDialogClose(): void {
    this.state = TriModalState.CLOSED;
    this.overlayRef.dispose();
    this.destroy$.next();
  }
}
