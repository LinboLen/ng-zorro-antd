/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriTreeNode } from './nz-tree-base-node';

export interface TriFormatEmitEvent {
  eventName: string;
  node?: TriTreeNode | null;
  event?: MouseEvent | DragEvent | null;
  dragNode?: TriTreeNode;
  selectedKeys?: TriTreeNode[];
  checkedKeys?: TriTreeNode[];
  matchedKeys?: TriTreeNode[];
  nodes?: TriTreeNode[];
  keys?: string[];
}

export interface TriFormatBeforeDropEvent {
  dragNode: TriTreeNode;
  node: TriTreeNode;
  pos: number;
}

export interface TriTreeNodeBaseComponent {
  markForCheck(): void;
}
