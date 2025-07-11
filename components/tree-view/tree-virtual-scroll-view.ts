/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BaseTreeControl, CdkTree, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTreeVirtualNodeData, TriTreeVirtualScrollNodeOutletDirective } from './node';
import { TriTreeNodeOutletDirective } from './outlet';
import { TriTreeView } from './tree';

const DEFAULT_SIZE = 28;

@Component({
  selector: 'tri-tree-virtual-scroll-view',
  exportAs: 'triTreeVirtualScrollView',
  template: `
    <div class="tri-tree-list">
      <cdk-virtual-scroll-viewport
        class="tri-tree-list-holder"
        [itemSize]="itemSize"
        [minBufferPx]="minBufferPx"
        [maxBufferPx]="maxBufferPx"
      >
        <ng-container *cdkVirtualFor="let item of nodes; let i = index; trackBy: innerTrackBy">
          <ng-template treeVirtualScrollNodeOutlet [data]="item" [compareBy]="compareBy"></ng-template>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </div>
    <ng-container treeNodeOutlet></ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: TriTreeView, useExisting: forwardRef(() => TriTreeVirtualScrollViewComponent) },
    { provide: CdkTree, useExisting: forwardRef(() => TriTreeVirtualScrollViewComponent) }
  ],
  host: {
    class: 'tri-tree',
    '[class.tri-tree-block-node]': 'directoryTree || blockNode',
    '[class.tri-tree-directory]': 'directoryTree',
    '[class.tri-tree-rtl]': `dir === 'rtl'`
  },
  imports: [
    TriTreeVirtualScrollNodeOutletDirective,
    CdkVirtualForOf,
    TriTreeNodeOutletDirective,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll
  ]
})
export class TriTreeVirtualScrollViewComponent<T> extends TriTreeView<T> implements OnChanges {
  @ViewChild(TriTreeNodeOutletDirective, { static: true }) readonly nodeOutlet!: TriTreeNodeOutletDirective;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) readonly virtualScrollViewport!: CdkVirtualScrollViewport;

  @Input() itemSize = DEFAULT_SIZE;
  @Input() minBufferPx = DEFAULT_SIZE * 5;
  @Input() maxBufferPx = DEFAULT_SIZE * 10;
  @Input() override trackBy: TrackByFunction<T> = null!;
  nodes: Array<TriTreeVirtualNodeData<T>> = [];
  innerTrackBy: TrackByFunction<TriTreeVirtualNodeData<T>> = i => i;

  ngOnChanges({ trackBy }: SimpleChanges): void {
    if (trackBy) {
      if (typeof trackBy.currentValue === 'function') {
        this.innerTrackBy = (index: number, n) => this.trackBy(index, n.data);
      } else {
        this.innerTrackBy = i => i;
      }
    }
  }

  get compareBy(): ((value: T) => TriSafeAny) | null {
    const baseTreeControl = this.treeControl as BaseTreeControl<T, TriSafeAny>;
    if (baseTreeControl.trackBy) {
      return baseTreeControl.trackBy;
    }

    return null;
  }

  override renderNodeChanges(data: T[] | readonly T[]): void {
    this.nodes = new Array(...data).map((n, i) => this.createNode(n, i));
    this._dataSourceChanged.next();
    this.cdr.markForCheck();
  }

  /**
   * @note
   * angular/cdk v18.2.0 breaking changes: https://github.com/angular/components/pull/29062
   * Temporary workaround: revert to old method of getting level
   * TODO: refactor tree-view, remove #treeControl and adopt #levelAccessor and #childrenAccessor
   * */
  override _getLevel(nodeData: T): number | undefined {
    if (this.treeControl?.getLevel) {
      return this.treeControl.getLevel(nodeData);
    }
    return;
  }

  private createNode(nodeData: T, index: number): TriTreeVirtualNodeData<T> {
    const node = this._getNodeDef(nodeData, index);
    const context = new CdkTreeNodeOutletContext<T>(nodeData);
    if (this.treeControl?.getLevel) {
      context.level = this.treeControl.getLevel(nodeData);
    } else {
      context.level = 0;
    }
    return {
      data: nodeData,
      context,
      nodeDef: node
    };
  }
}
