/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { TriValidateStatus } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

const iconTypeMap = {
  error: 'close-circle-fill',
  validating: 'loading',
  success: 'check-circle-fill',
  warning: 'exclamation-circle-fill'
} as const;

@Component({
  selector: 'tri-form-item-feedback-icon',
  exportAs: 'triFormFeedbackIcon',
  imports: [TriIconModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (iconType) {
      <tri-icon [type]="iconType" />
    }
  `,
  host: {
    class: 'tri-form-item-feedback-icon',
    '[class.tri-form-item-feedback-icon-error]': 'status==="error"',
    '[class.tri-form-item-feedback-icon-warning]': 'status==="warning"',
    '[class.tri-form-item-feedback-icon-success]': 'status==="success"',
    '[class.tri-form-item-feedback-icon-validating]': 'status==="validating"'
  }
})
export class TriFormItemFeedbackIconComponent implements OnChanges {
  public cdr = inject(ChangeDetectorRef);
  @Input() status: TriValidateStatus = '';

  iconType: (typeof iconTypeMap)[keyof typeof iconTypeMap] | null = null;

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateIcon();
  }

  updateIcon(): void {
    this.iconType = this.status ? iconTypeMap[this.status] : null;
    this.cdr.markForCheck();
  }
}
