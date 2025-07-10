/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTreeDropIndicatorComponent } from './tree-drop-indicator.component';
import { TriTreeIndentComponent } from './tree-indent.component';
import { TriTreeNodeBuiltinCheckboxComponent } from './tree-node-checkbox.component';
import { TriTreeNodeSwitcherComponent } from './tree-node-switcher.component';
import { TriTreeNodeTitleComponent } from './tree-node-title.component';
import { TriTreeNodeBuiltinComponent } from './tree-node.component';
import { TriTreeComponent } from './tree.component';

@NgModule({
  imports: [
    TriTreeComponent,
    TriTreeNodeBuiltinComponent,
    TriTreeIndentComponent,
    TriTreeNodeSwitcherComponent,
    TriTreeNodeBuiltinCheckboxComponent,
    TriTreeNodeTitleComponent,
    TriTreeDropIndicatorComponent
  ],

  exports: [TriTreeComponent, TriTreeNodeBuiltinComponent, TriTreeIndentComponent]
})
export class TriTreeModule {}
