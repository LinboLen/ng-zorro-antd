/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTreeNodeCheckboxComponent } from './checkbox';
import { TriTreeNodeIndentLineDirective, TriTreeNodeIndentsComponent } from './indent';
import { TriTreeNodeComponent, TriTreeNodeDefDirective, TriTreeVirtualScrollNodeOutletDirective } from './node';
import { TriTreeNodeOptionComponent } from './option';
import { TriTreeNodeOutletDirective } from './outlet';
import { TriTreeNodePaddingDirective } from './padding';
import {
  TriTreeNodeNoopToggleDirective,
  TriTreeNodeToggleActiveIconDirective,
  TriTreeNodeToggleDirective,
  TriTreeNodeToggleRotateIconDirective
} from './toggle';
import { TriTreeView } from './tree';
import { TriTreeViewComponent } from './tree-view';
import { TriTreeVirtualScrollViewComponent } from './tree-virtual-scroll-view';

const treeWithControlComponents = [
  TriTreeView,
  TriTreeNodeOutletDirective,
  TriTreeViewComponent,
  TriTreeNodeDefDirective,
  TriTreeNodeComponent,
  TriTreeNodeToggleDirective,
  TriTreeNodePaddingDirective,
  TriTreeNodeToggleRotateIconDirective,
  TriTreeNodeToggleActiveIconDirective,
  TriTreeNodeOptionComponent,
  TriTreeNodeNoopToggleDirective,
  TriTreeNodeCheckboxComponent,
  TriTreeNodeIndentsComponent,
  TriTreeVirtualScrollViewComponent,
  TriTreeVirtualScrollNodeOutletDirective,
  TriTreeNodeIndentLineDirective
];

@NgModule({
  imports: [treeWithControlComponents],
  exports: [treeWithControlComponents]
})
export class TriTreeViewModule {}
