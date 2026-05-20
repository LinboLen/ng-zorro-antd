/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { computed, Directive, inject, input } from '@angular/core';

import { responsiveArray, type ResponsiveLike } from 'ng-zorro-antd/core/services';
import type { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { generateClassName, isNotNil, isNumber, isPlainObject } from 'ng-zorro-antd/core/util';

import { TriRowDirective } from './row.directive';

export type ColSpanType = number | string;

export interface ColSize {
  span?: ColSpanType;
  pull?: ColSpanType;
  push?: ColSpanType;
  offset?: ColSpanType;
  order?: ColSpanType;
}

/**
 * @deprecated intended to be removed in v22, please use {@link ColSize} instead
 */
export type EmbeddedProperty = ColSize;

const CLASS_NAME = 'ant-col';

@Directive({
  selector: '[tri-col],tri-col,tri-form-control,tri-form-label',
  exportAs: 'triCol',
  host: {
    '[class]': 'hostClass()',
    '[class.tri-col-rtl]': `dir() === 'rtl'`,
    '[style]': 'gutterPaddingStyle()',
    '[style.flex]': 'flexStyle()'
  }
})
export class TriColDirective {
  private readonly rowDirective = inject(TriRowDirective, { host: true, optional: true });
  protected readonly dir = inject(Directionality).valueSignal;

  readonly flex = input<ColSpanType | null>();
  readonly span = input<ColSpanType | null>();
  readonly order = input<ColSpanType | null>();
  readonly offset = input<ColSpanType | null>();
  readonly push = input<ColSpanType | null>();
  readonly pull = input<ColSpanType | null>();
  readonly xs = input<ColSpanType | ColSize | null>();
  readonly sm = input<ColSpanType | ColSize | null>();
  readonly md = input<ColSpanType | ColSize | null>();
  readonly lg = input<ColSpanType | ColSize | null>();
  readonly xl = input<ColSpanType | ColSize | null>();
  readonly xXl = input<ColSpanType | ColSize | null>();

  protected readonly responsiveClass = computed(() => {
    const xs = this.xs();
    const sm = this.sm();
    const md = this.md();
    const lg = this.lg();
    const xl = this.xl();
    const xxl = this.xXl();
    return this.generateClassList({ xs, sm, md, lg, xl, xxl });
  });

  protected readonly hostClass = computed(() => {
    const span = this.span();
    const order = this.order();
    const offset = this.offset();
    const push = this.push();
    const pull = this.pull();

    const classList = [CLASS_NAME];

    if (isNotNil(span)) {
      classList.push(this.generateClass(`${span}`));
    }

    if (order) {
      classList.push(this.generateClass(`order-${order}`));
    }

    if (offset) {
      classList.push(this.generateClass(`offset-${offset}`));
    }

    if (push) {
      classList.push(this.generateClass(`push-${push}`));
    }

    if (pull) {
      classList.push(this.generateClass(`pull-${pull}`));
    }

    return classList.concat(this.responsiveClass());
  });

  protected readonly flexStyle = computed(() => {
    const flex = this.flex();
    if (typeof flex === 'number') {
      return `${flex} ${flex} auto`;
    } else if (typeof flex === 'string') {
      if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
        return `0 0 ${flex}`;
      }
    }
    return flex;
  });

  protected readonly gutterPaddingStyle = computed<NgStyleInterface>(() => {
    if (!this.rowDirective) {
      return {};
    }
    const [gutterH] = this.rowDirective._gutter();
    const style: NgStyleInterface = {};

    // Horizontal gutter use padding
    if (gutterH) {
      const horizontalGutter = isNumber(gutterH) ? coerceCssPixelValue(gutterH / 2) : `calc(${gutterH} / 2)`;
      style['padding-inline'] = horizontalGutter;
    }

    return style;
  });

  private generateClassList(props: Partial<ResponsiveLike<ColSpanType | ColSize | null>>): string[] {
    const classList: string[] = [];

    responsiveArray.forEach(size => {
      let sizeProps: ColSize = {};
      const propSize = props[size];
      if (isNumber(propSize) || typeof propSize === 'string') {
        sizeProps.span = propSize;
      } else if (isPlainObject(propSize)) {
        sizeProps = propSize || {};
      }

      const { span, pull, push, offset, order } = sizeProps;

      if (isNotNil(span)) {
        classList.push(this.generateClass(`${size}-${span}`));
      }

      if (order || order === 0) {
        classList.push(this.generateClass(`${size}-order-${order}`));
      }

      if (offset || offset === 0) {
        classList.push(this.generateClass(`${size}-offset-${offset}`));
      }

      if (push || push === 0) {
        classList.push(this.generateClass(`${size}-push-${push}`));
      }

      if (pull || pull === 0) {
        classList.push(this.generateClass(`${size}-pull-${pull}`));
      }
    });

    return classList;
  }

  private generateClass(suffix: string): string {
    return generateClassName(CLASS_NAME, suffix);
  }
}
