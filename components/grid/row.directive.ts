/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { booleanAttribute, computed, Directive, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ResponsiveLike, TriBreakpointKey, gridResponsiveMap, TriBreakpointService } from 'ng-zorro-antd/core/services';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { generateClassName, isNotNil, isNumber, isPlainObject } from 'ng-zorro-antd/core/util';

export type TriJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
export type TriAlign = 'top' | 'middle' | 'bottom' | 'stretch';
export type Gutter = number | string | undefined | Partial<ResponsiveLike<number | string>>;

type Gap = number | string | undefined;

const CLASS_NAME = 'ant-row';

@Directive({
  selector: '[tri-row],tri-row,tri-form-item',
  exportAs: 'triRow',
  host: {
    class: 'tri-row',
    '[class]': `flexClass() + ' ' + alignClass()`,
    '[class.tri-row-rtl]': `dir() === 'rtl'`,
    '[class.tri-row-no-wrap]': `!wrap()`,
    '[style]': `gutterStyle()`
  }
})
export class TriRowDirective {
  private readonly mediaMatcher = inject(MediaMatcher);
  private readonly platform = inject(Platform);
  private readonly breakpointService = inject(TriBreakpointService);
  protected readonly dir = inject(Directionality).valueSignal;

  readonly align = input<TriAlign | null>(null);
  readonly justify = input<TriJustify | null>(null);
  readonly gutter = input<Gutter | [Gutter, Gutter] | null>(undefined);
  readonly wrap = input(true, { transform: booleanAttribute });

  /**
   * Internal signal tracking the current breakpoint.
   * Used to trigger recomputation of responsive gutters when viewport changes.
   */
  private readonly currentBreakpoint = this.platform.isBrowser
    ? toSignal(this.breakpointService.subscribe(gridResponsiveMap))
    : signal(undefined);

  protected readonly alignClass = computed<string>(() => {
    const align = this.align();
    return isNotNil(align) ? this.generateClass(align) : '';
  });

  protected readonly flexClass = computed<string>(() => {
    const justify = this.justify();
    return isNotNil(justify) ? this.generateClass(justify) : '';
  });

  readonly _gutter = computed<[Gap, Gap]>(() => {
    // Subscribe to breakpoint changes so this computed recomputes on viewport resize
    this.currentBreakpoint();

    const results: [Gap, Gap] = [undefined, undefined];
    const gutter = this.gutter() ?? 0;
    const normalizedGutter = Array.isArray(gutter) ? gutter : ([gutter, undefined] as [Gutter, Gutter]);
    normalizedGutter.forEach((g, index) => {
      if (isPlainObject(g)) {
        Object.keys(gridResponsiveMap).map(screen => {
          const bp = screen as TriBreakpointKey;
          if (this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches && g[bp]) {
            results[index] = g[bp];
          }
        });
      } else {
        results[index] = g;
      }
    });
    return results;
  });

  protected readonly gutterStyle = computed<NgStyleInterface>(() => {
    const [gutterH, gutterV] = this._gutter();
    const style: NgStyleInterface = {};

    if (gutterH) {
      const horizontalGutter = isNumber(gutterH) ? coerceCssPixelValue(gutterH / -2) : `calc(${gutterH} / -2)`;
      style['margin-inline'] = horizontalGutter;
    }

    style['row-gap'] = coerceCssPixelValue(gutterV);

    return style;
  });

  private generateClass(suffix: string): string {
    return generateClassName(CLASS_NAME, suffix);
  }
}
