/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';

import { TriCronExpressionLabelI18n } from 'ng-zorro-antd/i18n';

import { TimeType } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triCronExpressionLabel',
  template: `
    <div class="tri-cron-expression-label" [class.tri-cron-expression-label-foucs]="labelFocus === type">
      <label>
        {{ locale[type] }}
      </label>
    </div>
  `
})
export class TriCronExpressionLabelComponent {
  @Input() type: TimeType = 'second';
  @Input() locale!: TriCronExpressionLabelI18n;
  @Input() labelFocus: string | null = null;
}
