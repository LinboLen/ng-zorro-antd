/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTimePickerPanelComponent } from './time-picker-panel.component';
import { TriTimePickerComponent } from './time-picker.component';

@NgModule({
  imports: [TriTimePickerComponent, TriTimePickerPanelComponent],
  exports: [TriTimePickerPanelComponent, TriTimePickerComponent]
})
export class TriTimePickerModule {}
