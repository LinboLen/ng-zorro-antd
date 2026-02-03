/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { getLocaleNumberSymbol, NgTemplateOutlet, NumberSymbol } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  LOCALE_ID,
  OnChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriStatisticValueType } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-statistic-content-value',
  exportAs: 'triStatisticContentValue',
  template: `
    @if (valueTemplate) {
      <ng-container [ngTemplateOutlet]="valueTemplate" [ngTemplateOutletContext]="{ $implicit: value }" />
    } @else {
      @if (displayInt) {
        <span class="tri-statistic-content-value-int">{{ displayInt }}</span>
      }
      @if (displayDecimal) {
        <span class="tri-statistic-content-value-decimal">{{ displayDecimal }}</span>
      }
    }
  `,
  imports: [NgTemplateOutlet],
  host: {
    class: 'tri-statistic-content-value'
  }
})
export class TriStatisticContentValueComponent implements OnChanges {
  @Input() value?: TriStatisticValueType;
  @Input() valueTemplate?: TemplateRef<{ $implicit: TriStatisticValueType }>;

  displayInt = '';
  displayDecimal = '';

  private locale_id = inject(LOCALE_ID);

  ngOnChanges(): void {
    this.formatNumber();
  }

  private formatNumber(): void {
    const decimalSeparator: string =
      typeof this.value === 'number' ? '.' : getLocaleNumberSymbol(this.locale_id, NumberSymbol.Decimal);
    const value = String(this.value);
    const [int, decimal] = value.split(decimalSeparator);

    this.displayInt = int;
    this.displayDecimal = decimal ? `${decimalSeparator}${decimal}` : '';
  }
}
