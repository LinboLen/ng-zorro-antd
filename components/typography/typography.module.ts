/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTextCopyComponent } from './text-copy.component';
import { TriTextEditComponent } from './text-edit.component';
import { TriTypographyComponent } from './typography.component';

@NgModule({
  imports: [TriTypographyComponent, TriTextCopyComponent, TriTextEditComponent],
  exports: [TriTypographyComponent, TriTextCopyComponent, TriTextEditComponent]
})
export class TriTypographyModule {}
