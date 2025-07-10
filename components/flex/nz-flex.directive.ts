/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input, booleanAttribute } from '@angular/core';

import { TriAlign, TriFlex, TriGap, TriJustify, TriWrap } from './typings';

@Directive({
  selector: '',
  exportAs: 'triFlex',
  host: {
    class: 'tri-flex',
    '[class.tri-flex-vertical]': `vertical`,
    '[class.tri-flex-justify-flex-start]': `justify === 'flex-start'`,
    '[class.tri-flex-justify-center]': `justify === 'center'`,
    '[class.tri-flex-justify-flex-end]': `justify === 'flex-end'`,
    '[class.tri-flex-justify-space-between]': `justify === 'space-between'`,
    '[class.tri-flex-justify-space-around]': `justify === 'space-around'`,
    '[class.tri-flex-justify-space-evenly]': `justify === 'space-evenly'`,
    '[class.tri-flex-justify-start]': `justify === 'start'`,
    '[class.tri-flex-justify-end]': `justify === 'end'`,
    '[class.tri-flex-justify-right]': `justify === 'right'`,
    '[class.tri-flex-justify-left]': `justify === 'left'`,
    '[class.tri-flex-justify-stretch]': `justify === 'stretch'`,
    '[class.tri-flex-justify-normal]': `justify === 'normal'`,
    '[class.tri-flex-align-flex-start]': `align === 'flex-start'`,
    '[class.tri-flex-align-center]': `align === 'center'`,
    '[class.tri-flex-align-flex-end]': `align === 'flex-end'`,
    '[class.tri-flex-align-space-between]': `align === 'space-between'`,
    '[class.tri-flex-align-space-around]': `align === 'space-around'`,
    '[class.tri-flex-align-space-evenly]': `align === 'space-evenly'`,
    '[class.tri-flex-align-start]': `align === 'start'`,
    '[class.tri-flex-align-end]': `align === 'end'`,
    '[class.tri-flex-align-right]': `align === 'right'`,
    '[class.tri-flex-align-left]': `align === 'left'`,
    '[class.tri-flex-align-stretch]': `align === 'stretch'`,
    '[class.tri-flex-align-normal]': `align === 'normal'`,
    '[class.tri-flex-wrap-wrap]': `wrap === 'wrap'`,
    '[class.tri-flex-wrap-wrap-reverse]': `wrap === 'wrap-reverse'`,
    '[class.tri-flex-wrap-nowrap]': `wrap === 'nowrap'`,
    '[style.gap]': `gap`,
    '[style.flex]': `nzFlex`
  }
})
export class TriFlexDirective {
  @Input({ transform: booleanAttribute }) vertical: boolean = false;
  @Input() justify: TriJustify = 'normal';
  @Input() align: TriAlign = 'normal';
  @Input() gap: TriGap = 0;
  @Input() wrap: TriWrap = 'nowrap';
  @Input() flex: TriFlex = 'unset';

  protected get _gap(): string {
    switch (this.gap) {
      case 'small':
        return '8px';
      case 'middle':
        return '16px';
      case 'large':
        return '24px';
      default:
        if (typeof this.gap === 'number') {
          return `${this.gap}px`;
        }
        return this.gap;
    }
  }
}
