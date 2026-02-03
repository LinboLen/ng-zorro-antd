/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewEncapsulation } from '@angular/core';

export type TriFormControlStatusType = 'success' | 'error' | 'warning' | 'validating' | '';

/** should add nz-row directive to host, track https://github.com/angular/angular/issues/8785 **/
@Component({
  selector: 'tri-form-item',
  exportAs: 'triFormItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-form-item',
    '[class.tri-form-item-has-success]': 'status === "success"',
    '[class.tri-form-item-has-warning]': 'status === "warning"',
    '[class.tri-form-item-has-error]': 'status === "error"',
    '[class.tri-form-item-is-validating]': 'status === "validating"',
    '[class.tri-form-item-has-feedback]': 'hasFeedback && status',
    '[class.tri-form-item-with-help]': 'withHelpClass'
  },
  template: `<ng-content />`
})
export class TriFormItemComponent {
  private cdr = inject(ChangeDetectorRef);

  status: TriFormControlStatusType = '';
  hasFeedback = false;
  withHelpClass = false;

  setWithHelpViaTips(value: boolean): void {
    this.withHelpClass = value;
    this.cdr.markForCheck();
  }

  setStatus(status: TriFormControlStatusType): void {
    this.status = status;
    this.cdr.markForCheck();
  }

  setHasFeedback(hasFeedback: boolean): void {
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
  }
}
