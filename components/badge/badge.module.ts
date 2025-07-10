/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriBadgeComponent } from './badge.component';
import { TriRibbonComponent } from './ribbon.component';

@NgModule({
  exports: [TriBadgeComponent, TriRibbonComponent],
  imports: [TriBadgeComponent, TriRibbonComponent]
})
export class TriBadgeModule {}
