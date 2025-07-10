/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

import { TriStatisticNumberComponent } from './statistic-number.component';
import { TriStatisticValueType } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triStatistic',
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
        <tri-statistic-number [value]="value" [valueTemplate]="valueTemplate"></tri-statistic-number>
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
    '[class.tri-statistic-rtl]': `dir === 'rtl'`
  },
  imports: [TriSkeletonModule, TriStatisticNumberComponent, TriOutletModule]
})
export class TriStatisticComponent implements OnInit {
  @Input() prefix?: string | TemplateRef<void>;
  @Input() suffix?: string | TemplateRef<void>;
  @Input() title?: string | TemplateRef<void>;
  @Input() value?: TriStatisticValueType;
  @Input() valueStyle: NgStyleInterface = {};
  @Input() valueTemplate?: TemplateRef<{ $implicit: TriStatisticValueType }>;
  @Input({ transform: booleanAttribute }) loading: boolean = false;
  dir: Direction = 'ltr';

  protected cdr = inject(ChangeDetectorRef);
  protected destroyRef = inject(DestroyRef);
  private directionality = inject(Directionality);

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }
}
