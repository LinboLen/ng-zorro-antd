/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { numberAttributeWithInfinityFallback } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isMaxMultipleCountSet) {
      <span>{{ listOfValue.length }} / {{ maxMultipleCount }}</span>
    }
    @if (loading) {
      <tri-icon type="loading" />
    } @else {
      @if (showArrow && !suffixIcon) {
        @if (search) {
          <tri-icon type="search" />
        } @else {
          <tri-icon type="down" />
        }
      } @else {
        <ng-container *stringTemplateOutlet="suffixIcon; let suffixIcon">
          @if (suffixIcon) {
            <tri-icon [type]="suffixIcon" />
          }
        </ng-container>
      }
    }
    <ng-container *stringTemplateOutlet="feedbackIcon">{{ feedbackIcon }}</ng-container>
  `,
  host: {
    class: 'tri-select-arrow',
    '[class.tri-select-arrow-loading]': 'loading'
  },
  imports: [TriIconModule, TriOutletModule]
})
export class TriSelectArrowComponent {
  @Input() listOfValue: TriSafeAny[] = [];
  @Input() loading = false;
  @Input() search = false;
  @Input() showArrow = false;
  @Input() isMaxMultipleCountSet = false;
  @Input() suffixIcon: TemplateRef<TriSafeAny> | string | null = null;
  @Input() feedbackIcon: TemplateRef<TriSafeAny> | string | null = null;
  @Input({ transform: numberAttributeWithInfinityFallback }) maxMultipleCount = Infinity;
}
