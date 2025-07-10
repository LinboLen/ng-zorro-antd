/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkTree } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { treeCollapseMotion } from 'ng-zorro-antd/core/animation';

import { TriTreeNodeOutletDirective } from './outlet';
import { TriTreeView } from './tree';

@Component({
  selector: '',
  exportAs: 'triTreeView',
  template: `
    <div class="tri-tree-list-holder">
      <div
        [@.disabled]="!_afterViewInit || !!noAnimation?.nzNoAnimation"
        [@treeCollapseMotion]="_nodeOutlet.viewContainer.length"
        class="tri-tree-list-holder-inner"
      >
        <ng-container treeNodeOutlet></ng-container>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: CdkTree, useExisting: forwardRef(() => TriTreeViewComponent) },
    { provide: TriTreeView, useExisting: forwardRef(() => TriTreeViewComponent) }
  ],
  host: {
    class: 'tri-tree',
    '[class.tri-tree-block-node]': 'directoryTree || blockNode',
    '[class.tri-tree-directory]': 'directoryTree',
    '[class.tri-tree-rtl]': `dir === 'rtl'`
  },
  animations: [treeCollapseMotion],
  imports: [TriTreeNodeOutletDirective]
})
export class TriTreeViewComponent<T> extends TriTreeView<T> implements AfterViewInit {
  @ViewChild(TriTreeNodeOutletDirective, { static: true }) nodeOutlet!: TriTreeNodeOutletDirective;
  _afterViewInit = false;

  override ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this._afterViewInit = true;
      this.cdr.markForCheck();
    });
  }
}
