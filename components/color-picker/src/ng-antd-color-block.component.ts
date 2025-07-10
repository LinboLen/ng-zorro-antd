/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { defaultColor } from './util/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  template: `
    <div class="tri-color-picker-color-block" (click)="onClick.emit(true)">
      <div class="tri-color-picker-color-block-inner" [style.background-color]="color"></div>
    </div>
  `
})
export class NgAntdColorBlockComponent {
  @Input() color: string = defaultColor.toHsbString();
  @Output() readonly onClick = new EventEmitter<boolean>();
}
