/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, inject } from '@angular/core';

import { TriDatePickerComponent } from './date-picker.component';

@Directive({
  selector: '',
  exportAs: 'triQuarterPicker'
})
export class TriQuarterPickerComponent {
  datePicker = inject(TriDatePickerComponent, { host: true });

  constructor() {
    this.datePicker.mode = 'quarter';
  }
}
