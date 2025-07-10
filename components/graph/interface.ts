/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  HierarchyBaseEdgeInfo,
  HierarchyBaseNodeInfo,
  HierarchyGraphDef,
  HierarchyGraphEdgeDef,
  HierarchyGraphNodeDef,
  HierarchyGraphNodeInfo,
  HierarchyGraphOption,
  LayoutConfig
} from 'dagre-compound';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

export enum NzGraphEdgeType {
  LINE = 'line',
  CURVE = 'curve'
}

export interface TriGraphDataDef extends HierarchyGraphDef {
  nodes: TriGraphNodeDef[];
  edges: TriGraphEdgeDef[];
}

export interface TriGraphNodeDef extends HierarchyGraphNodeDef {
  label?: string;
}

export interface TriGraphEdgeDef extends HierarchyGraphEdgeDef {
  label?: string;
}

export interface TriGraphOption extends HierarchyGraphOption {}
export declare type TriRankDirection = 'TB' | 'BT' | 'LR' | 'RL';

export interface TriGraphGroupNode extends HierarchyGraphNodeInfo {
  nodes: Array<TriGraphNode | TriGraphGroupNode>;
  edges: TriGraphEdge[];
  [key: string]: TriSafeAny;
}

export interface TriGraphNode extends HierarchyBaseNodeInfo {
  id: TriSafeAny;
  // TODO
  name: TriSafeAny;
  label?: string;
  [key: string]: TriSafeAny;
}

export interface TriGraphEdge extends HierarchyBaseEdgeInfo {
  id: TriSafeAny;
  v: TriSafeAny;
  w: TriSafeAny;
  label?: string;
}

export interface TriLayoutSetting extends LayoutConfig {}

export interface TriGraphBaseLayout {
  layout: {
    nodeSep: number;
    rankSep: number;
    edgeSep: number;
  };
  subScene: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    labelHeight: number;
  };
  defaultCompoundNode: {
    width: number;
    height: number;
    maxLabelWidth: number;
  };
  defaultNode: {
    width: number;
    height: number;
    labelOffset: number;
    maxLabelWidth: number;
  };
  defaultEdge: {
    type: NzGraphEdgeType | string; // Need to support extensions
  };
}

export function nzTypeDefinition<T>(): (item: unknown) => T {
  return item => item as T;
}

export type TriDeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<TriDeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<TriDeepPartial<U>>
      : TriDeepPartial<T[P]>;
};

export type TriGraphLayoutConfig = TriDeepPartial<TriGraphBaseLayout>;
export const NZ_GRAPH_LAYOUT_SETTING: TriLayoutSetting = {
  graph: {
    meta: {
      nodeSep: 50,
      rankSep: 50,
      edgeSep: 5
    }
  },
  subScene: {
    meta: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 20,
      paddingRight: 20,
      labelHeight: 20
    }
  },
  nodeSize: {
    meta: {
      width: 50,
      maxLabelWidth: 0,
      height: 50
    },
    node: {
      width: 50,
      height: 50,
      labelOffset: 10,
      maxLabelWidth: 40
    },
    bridge: {
      width: 5,
      height: 5,
      radius: 2,
      labelOffset: 0
    }
  }
};

// Zoom interface

export interface TriZoomTransform {
  x: number;
  y: number;
  k: number;
}

export interface RelativePositionInfo {
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}
