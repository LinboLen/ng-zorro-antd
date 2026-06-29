/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectorRef, Component, inject, input, output } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { isPromise } from 'ng-zorro-antd/core/util';
import { TriI18nPipe } from 'ng-zorro-antd/i18n';

import { TriModalRef } from './modal-ref';
import { ModalButtonOptions, ModalOptions } from './modal-types';

@Component({
  selector: 'div[nz-modal-footer]',
  exportAs: 'triModalFooterBuiltin',
  imports: [TriOutletModule, TriButtonModule, TriI18nPipe],
  template: `
    @if (footer) {
      <ng-container
        *stringTemplateOutlet="footer; stringTemplateOutletContext: { $implicit: data, modalRef: modalRef() }"
      >
        @if (buttons) {
          @for (button of buttons; track button) {
            <button
              tri-button
              (click)="onButtonClick(button)"
              [hidden]="!getButtonCallableProp(button, 'show')"
              [loading]="getButtonCallableProp(button, 'loading')"
              [disabled]="getButtonCallableProp(button, 'disabled')"
              [type]="button.type!"
              [danger]="button.danger"
              [shape]="button.shape!"
              [size]="button.size!"
              [ghost]="button.ghost!"
            >
              {{ button.label }}
            </button>
          }
        } @else {
          <div [innerHTML]="footer"></div>
        }
      </ng-container>
    } @else {
      @if (cancelText !== null) {
        <button
          [attr.cdkFocusInitial]="autofocus === 'cancel' || null"
          tri-button
          (click)="onCancel()"
          [loading]="cancelLoading"
          [disabled]="cancelDisabled"
        >
          {{ config.nzCancelText || ('Modal.cancelText' | nzI18n) }}
        </button>
      }
      @if (okText !== null) {
        <button
          [attr.cdkFocusInitial]="autofocus === 'ok' || null"
          tri-button
          [type]="okType!"
          [danger]="okDanger"
          (click)="onOk()"
          [loading]="okLoading"
          [disabled]="okDisabled"
        >
          {{ config.nzOkText || ('Modal.okText' | nzI18n) }}
        </button>
      }
    }
  `,
  host: {
    class: 'tri-modal-footer'
  }
})
export class TriModalFooterComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly config = inject(ModalOptions);

  readonly modalRef = input.required<TriModalRef>();
  readonly cancelTriggered = output();
  readonly okTriggered = output();

  protected buttons = Array.isArray(this.config.footer)
    ? (this.config.footer as ModalButtonOptions[]).map(mergeDefaultOption)
    : null;

  onCancel(): void {
    this.cancelTriggered.emit();
  }

  onOk(): void {
    this.okTriggered.emit();
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  /**
   * Returns the value of the specified key.
   * If it is a function, run and return the return value of the function.
   */
  getButtonCallableProp(options: ModalButtonOptions, prop: keyof ModalButtonOptions): boolean {
    const value = options[prop];
    const componentInstance = this.modalRef().getContentComponent();
    return typeof value === 'function' ? value.apply(options, componentInstance && [componentInstance]) : value;
  }

  /**
   * Run function based on the type and set its `loading` prop if needed.
   */
  onButtonClick(options: ModalButtonOptions): void {
    const loading = this.getButtonCallableProp(options, 'loading');
    if (!loading) {
      const result = this.getButtonCallableProp(options, 'onClick');
      if (options.autoLoading && isPromise(result)) {
        options.loading = true;
        result
          .then(() => (options.loading = false))
          .catch(e => {
            options.loading = false;
            throw e;
          });
      }
    }
  }
}

function mergeDefaultOption(options: ModalButtonOptions): ModalButtonOptions {
  return {
    type: null,
    size: 'default',
    autoLoading: true,
    show: true,
    loading: false,
    disabled: false,
    ...options
  };
}
