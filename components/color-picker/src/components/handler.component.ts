/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, Input } from '@angular/core';

type HandlerSize = 'default' | 'small';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: `
    <div
      class="tri-color-picker-handler"
      [style.background-color]="color"
      [class.tri-color-picker-handler-sm]="size === 'small'"
    ></div>
  `
})
export class HandlerComponent {
  @Input() color: string | null = null;
  @Input() size: HandlerSize = 'default';
}
