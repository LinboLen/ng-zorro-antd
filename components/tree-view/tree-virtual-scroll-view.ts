/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkTree, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriAnimationTreeCollapseService } from 'ng-zorro-antd/core/animation';
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
          <ng-template treeVirtualScrollNodeOutlet [data]="item" [compareBy]="compareBy(i)"></ng-template>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </div>
    <ng-container treeNodeOutlet></ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TriAnimationTreeCollapseService,
    { provide: TriTreeView, useExisting: forwardRef(() => TriTreeVirtualScrollViewComponent) },
    { provide: CdkTree, useExisting: forwardRef(() => TriTreeVirtualScrollViewComponent) }
  ],
  host: {
    class: 'tri-tree',
    '[class.tri-tree-block-node]': 'directoryTree || blockNode',
    '[class.tri-tree-directory]': 'directoryTree',
    '[class.tri-tree-rtl]': `dir() === 'rtl'`
  },
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    TriTreeNodeOutletDirective,
    TriTreeVirtualScrollNodeOutletDirective
  ]
})
export class TriTreeVirtualScrollViewComponent<T> extends TriTreeView<T> implements OnChanges {
  @ViewChild(TriTreeNodeOutletDirective, { static: true }) override readonly _nodeOutlet: TriTreeNodeOutletDirective =
    undefined!;
  @ViewChild(CdkVirtualScrollViewport, { static: true }) readonly virtualScrollViewport!: CdkVirtualScrollViewport;

  @Input() itemSize = DEFAULT_SIZE;
  @Input() minBufferPx = DEFAULT_SIZE * 5;
  @Input() maxBufferPx = DEFAULT_SIZE * 10;

  nodes: Array<TriTreeVirtualNodeData<T>> = [];

  innerTrackBy: TrackByFunction<TriTreeVirtualNodeData<T>> = i => i;

  constructor() {
    super();
    const treeCollapseService = inject(TriAnimationTreeCollapseService);
    treeCollapseService.virtualScroll = true;
  }

  ngOnChanges({ trackBy }: SimpleChanges): void {
    if (trackBy) {
      if (typeof trackBy.currentValue === 'function') {
        this.innerTrackBy = (index: number, n) => this.trackBy(index, n.data);
      } else {
        this.innerTrackBy = i => i;
      }
    }
  }

  compareBy(index: number): (value: T) => TriSafeAny {
    return (value: T) => (this.trackBy ? this.trackBy(index, value) : value);
  }

  override renderNodeChanges(data: T[]): void {
    /* https://github.com/angular/components/blob/21cc21ea3b280c3f82a19f5ec1b679eb1eee1358/src/cdk/tree/tree.ts#L1103
     * If levelAccessor is used, renderNodes needs to be recalculated, because flattenData (i.e., dataNodes) is used as renderNodes by default in the @angular/components library
     * If childrenAccessor is used, @angular/components library inner will calculate renderNodes.
     */
    const renderNodes = this.levelAccessor ? this.getRenderNodes(data) : [...data];
    this.nodes = renderNodes.map((n, i) => this.createNode(n, i));
    this.dataSourceChanged$.next();
    this.cdr.markForCheck();
  }

  private createNode(nodeData: T, index: number): TriTreeVirtualNodeData<T> {
    const node = this._getNodeDef(nodeData, index);
    const context = new CdkTreeNodeOutletContext<T>(nodeData);
    return {
      data: nodeData,
      context,
      nodeDef: node
    };
  }
}
