/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriSpaceCompactComponent } from './space-compact.component';
import { TriSpaceItemDirective } from './space-item.directive';
import { TriSpaceComponent } from './space.component';

@NgModule({
  imports: [TriSpaceComponent, TriSpaceItemDirective, TriSpaceCompactComponent],
  exports: [TriSpaceComponent, TriSpaceItemDirective, TriSpaceCompactComponent]
})
export class TriSpaceModule {}
