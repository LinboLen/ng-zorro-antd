/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriColorBlockComponent } from './color-block.component';
import { TriColorFormatComponent } from './color-format.component';
import { TriColorPickerComponent } from './color-picker.component';

@NgModule({
  imports: [TriColorPickerComponent, TriColorBlockComponent, TriColorFormatComponent],
  exports: [TriColorPickerComponent, TriColorBlockComponent]
})
export class TriColorPickerModule {}
