/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTreeNode } from './nz-tree-base-node';
import { TriTreeBaseService } from './nz-tree-base.service';

export class TriTreeBase {
  constructor(public nzTreeService: TriTreeBaseService) {}

  /**
   * Coerces a value({@link any[]}) to a TreeNodes({@link TriTreeNode[]})
   */
  coerceTreeNodes(value: TriSafeAny[]): TriTreeNode[] {
    let nodes: TriTreeNode[] = [];
    if (!this.nzTreeService.isArrayOfNzTreeNode(value)) {
      // has not been new NzTreeNode
      nodes = value.map(item => new TriTreeNode(item, null, this.nzTreeService));
    } else {
      nodes = value.map((item: TriTreeNode) => {
        item.service = this.nzTreeService;
        return item;
      });
    }
    return nodes;
  }

  /**
   * Get all nodes({@link TriTreeNode})
   */
  getTreeNodes(): TriTreeNode[] {
    return this.nzTreeService.rootNodes;
  }

  /**
   * Get {@link TriTreeNode} with key
   */
  getTreeNodeByKey(key: string): TriTreeNode | null {
    // flat tree nodes
    const nodes: TriTreeNode[] = [];
    const getNode = (node: TriTreeNode): void => {
      nodes.push(node);
      node.getChildren().forEach(n => {
        getNode(n);
      });
    };
    this.getTreeNodes().forEach(n => {
      getNode(n);
    });
    return nodes.find(n => n.key === key) || null;
  }

  /**
   * Get checked nodes(merged)
   */
  getCheckedNodeList(): TriTreeNode[] {
    return this.nzTreeService.getCheckedNodeList();
  }

  /**
   * Get selected nodes
   */
  getSelectedNodeList(): TriTreeNode[] {
    return this.nzTreeService.getSelectedNodeList();
  }

  /**
   * Get half checked nodes
   */
  getHalfCheckedNodeList(): TriTreeNode[] {
    return this.nzTreeService.getHalfCheckedNodeList();
  }

  /**
   * Get expanded nodes
   */
  getExpandedNodeList(): TriTreeNode[] {
    return this.nzTreeService.getExpandedNodeList();
  }

  /**
   * Get matched nodes(if nzSearchValue is not null)
   */
  getMatchedNodeList(): TriTreeNode[] {
    return this.nzTreeService.getMatchedNodeList();
  }
}
