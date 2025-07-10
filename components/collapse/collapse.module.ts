/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriCollapsePanelComponent } from './collapse-panel.component';
import { TriCollapseComponent } from './collapse.component';

@NgModule({
  imports: [TriCollapsePanelComponent, TriCollapseComponent],
  exports: [TriCollapsePanelComponent, TriCollapseComponent]
})
export class TriCollapseModule {}
