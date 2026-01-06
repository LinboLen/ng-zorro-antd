/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkTree } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, forwardRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { TriAnimationTreeCollapseService } from 'ng-zorro-antd/core/animation';

import { TriTreeNodeOutletDirective } from './outlet';
import { TriTreeView } from './tree';

@Component({
  selector: 'tri-tree-view',
  exportAs: 'triTreeView',
  imports: [TriTreeNodeOutletDirective],
  template: `
    <div class="tri-tree-list-holder">
      <div class="tri-tree-list-holder-inner">
        <ng-container treeNodeOutlet></ng-container>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TriAnimationTreeCollapseService,
    { provide: CdkTree, useExisting: forwardRef(() => TriTreeViewComponent) },
    { provide: TriTreeView, useExisting: forwardRef(() => TriTreeViewComponent) }
  ],
  host: {
    class: 'tri-tree',
    '[class.tri-tree-block-node]': 'directoryTree || blockNode',
    '[class.tri-tree-directory]': 'directoryTree',
    '[class.tri-tree-rtl]': `dir() === 'rtl'`
  }
})
export class TriTreeViewComponent<T> extends TriTreeView<T> {
  @ViewChild(TriTreeNodeOutletDirective, { static: true }) nodeOutlet!: TriTreeNodeOutletDirective;
}
