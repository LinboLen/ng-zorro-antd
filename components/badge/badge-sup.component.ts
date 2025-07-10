/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { zoomBadgeMotion } from 'ng-zorro-antd/core/animation';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriSafeAny, TriSizeDSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: '',
  exportAs: 'triBadgeSup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [zoomBadgeMotion],
  imports: [TriNoAnimationDirective],
  template: `
    @if (count <= overflowCount) {
      @for (n of maxNumberArray; track n; let i = $index) {
        <span
          [noAnimation]="noAnimation"
          class="tri-scroll-number-only"
          [style.transform]="'translateY(' + -countArray[i] * 100 + '%)'"
        >
          @if (!dot && countArray[i] !== undefined) {
            @for (p of countSingleArray; track p) {
              <p class="tri-scroll-number-only-unit" [class.current]="p === countArray[i]">
                {{ p }}
              </p>
            }
          }
        </span>
      }
    } @else {
      {{ overflowCount }}+
    }
  `,
  host: {
    class: 'tri-scroll-number',
    '[@.disabled]': `disableAnimation`,
    '[@zoomBadgeMotion]': '',
    '[attr.title]': `nzTitle === null ? '' : nzTitle || nzCount`,
    '[style]': `nzStyle`,
    '[style.right.px]': `nzOffset && nzOffset[0] ? -nzOffset[0] : null`,
    '[style.margin-top.px]': `nzOffset && nzOffset[1] ? nzOffset[1] : null`,
    '[class.tri-badge-count]': `!dot`,
    '[class.tri-badge-count-sm]': `size === 'small'`,
    '[class.tri-badge-dot]': `dot`,
    '[class.tri-badge-multiple-words]': `countArray.length >= 2`
  }
})
export class TriBadgeSupComponent implements OnInit, OnChanges {
  @Input() offset?: [number, number];
  @Input() title?: string | null | undefined;
  @Input() style: Record<string, string> | null = null;
  @Input() dot = false;
  @Input({ transform: numberAttribute }) overflowCount: number = 99;
  @Input() disableAnimation = false;
  @Input() count?: number | TemplateRef<TriSafeAny>;
  @Input() noAnimation = false;
  @Input() size: TriSizeDSType = 'default';
  maxNumberArray: string[] = [];
  countArray: number[] = [];
  _count: number = 0;
  countSingleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  generateMaxNumberArray(): void {
    this.maxNumberArray = this.overflowCount
      .toString()
      .split('')
      .map((value: string, index: number) => `${value}-${index}`);
  }

  ngOnInit(): void {
    this.generateMaxNumberArray();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOverflowCount, nzCount } = changes;
    if (nzCount && typeof nzCount.currentValue === 'number') {
      this._count = Math.max(0, nzCount.currentValue);
      this.countArray = this._count
        .toString()
        .split('')
        .map(item => +item);
    }
    if (nzOverflowCount) {
      this.generateMaxNumberArray();
    }
  }
}
