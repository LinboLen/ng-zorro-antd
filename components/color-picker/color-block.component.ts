/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

import { NgAntdColorPickerModule } from './src/ng-antd-color-picker.module';
import { defaultColor } from './src/util/util';

@Component({
  selector: '',
  exportAs: 'triColorBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgAntdColorPickerModule],
  template: `<ng-antd-color-block [color]="color" (onClick)="onClick.emit($event)"></ng-antd-color-block>`,
  host: {
    class: 'tri-color-picker-inline',
    '[class.tri-color-picker-inline-sm]': `size === 'small'`,
    '[class.tri-color-picker-inline-lg]': `size === 'large'`
  }
})
export class TriColorBlockComponent {
  @Input() color: string = defaultColor.toHexString();
  @Input() size: TriSizeLDSType = 'default';
  @Output() readonly onClick = new EventEmitter<boolean>();
}
