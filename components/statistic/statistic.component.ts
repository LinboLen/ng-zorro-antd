/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Component, Input, TemplateRef, ViewEncapsulation, booleanAttribute, inject } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

import { TriStatisticContentValueComponent } from './statistic-content-value.component';
import { TriStatisticValueType } from './typings';

@Component({
  selector: 'tri-statistic',
  exportAs: 'triStatistic',
  encapsulation: ViewEncapsulation.None,
  imports: [TriSkeletonModule, TriStatisticContentValueComponent, TriOutletModule],
  template: `
    <div class="tri-statistic-title">
      <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
    </div>
    @if (loading) {
      <tri-skeleton class="tri-statistic-skeleton" [paragraph]="false" />
    } @else {
      <div class="tri-statistic-content" [style]="valueStyle">
        @if (prefix) {
          <span class="tri-statistic-content-prefix">
            <ng-container *stringTemplateOutlet="prefix">{{ prefix }}</ng-container>
          </span>
        }
        <tri-statistic-content-value [value]="value" [valueTemplate]="valueTemplate" />
        @if (suffix) {
          <span class="tri-statistic-content-suffix">
            <ng-container *stringTemplateOutlet="suffix">{{ suffix }}</ng-container>
          </span>
        }
      </div>
    }
  `,
  host: {
    class: 'tri-statistic',
    '[class.tri-statistic-rtl]': `dir() === 'rtl'`
  }
})
export class TriStatisticComponent {
  protected readonly dir = inject(Directionality).valueSignal;

  @Input() prefix?: string | TemplateRef<void>;
  @Input() suffix?: string | TemplateRef<void>;
  @Input() title?: string | TemplateRef<void>;
  @Input() value?: TriStatisticValueType;
  @Input() valueStyle: NgStyleInterface = {};
  @Input() valueTemplate?: TemplateRef<{ $implicit: TriStatisticValueType }>;
  @Input({ transform: booleanAttribute }) loading: boolean = false;
}
