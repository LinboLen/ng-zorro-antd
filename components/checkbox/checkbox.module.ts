/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriCheckboxGroupComponent } from './checkbox-group.component';
import { TriCheckboxWrapperComponent } from './checkbox-wrapper.component';
import { TriCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [TriCheckboxComponent, TriCheckboxGroupComponent, TriCheckboxWrapperComponent],
  exports: [TriCheckboxComponent, TriCheckboxGroupComponent, TriCheckboxWrapperComponent]
})
export class TriCheckboxModule {}
