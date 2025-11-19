/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { defaultColor } from './util/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ng-antd-color-block',
  template: `<div class="tri-color-picker-color-block-inner" [style.background-color]="color"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-color-picker-color-block',
    '(click)': 'nzOnClick.emit()'
  }
})
export class NgAntdColorBlockComponent {
  @Input() color: string = defaultColor.toHsbString();
  @Output() readonly onClick = new EventEmitter<void>();
}
