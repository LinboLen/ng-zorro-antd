/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';

import { TriTreeBaseService, TriTreeNode, TriTreeNodeKey } from 'ng-zorro-antd/core/tree';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { arraysEqual, isNotNil } from 'ng-zorro-antd/core/util';

import { TriCascaderOption } from './typings';

interface InternalFieldNames {
  label: string;
  value: string;
}

@Injectable()
export class TriCascaderTreeService extends TriTreeBaseService {
  fieldNames: InternalFieldNames = {
    label: 'label',
    value: 'value'
  };

  override treeNodePostProcessor = (node: TriTreeNode): void => {
    node.key = this.getOptionValue(node);
    node.title = this.getOptionLabel(node);
  };

  getOptionValue(node: TriTreeNode): TriSafeAny {
    return node.origin[this.fieldNames.value || 'value'];
  }

  getOptionLabel(node: TriTreeNode): string {
    return node.origin[this.fieldNames.label || 'label'];
  }

  get children(): TriTreeNode[] {
    return this.rootNodes;
  }

  set children(value: Array<TriTreeNode | TriSafeAny>) {
    this.rootNodes = value.map(v => (v instanceof TriTreeNode ? v : new TriTreeNode(v, null)));
  }

  /**
   * Map list of nodes to list of option
   */
  toOptions(nodes: TriTreeNode[]): TriCascaderOption[] {
    return nodes.map(node => node.origin);
  }

  getAncestorNodeList(node: TriTreeNode | null): TriTreeNode[] {
    if (!node) {
      return [];
    }
    if (node.parentNode) {
      return [...this.getAncestorNodeList(node.parentNode), node];
    }
    return [node];
  }

  /**
   * Render by nzCheckedKeys
   * When keys equals null, just render with checkStrictly
   *
   * @param paths
   * @param checkStrictly
   */
  conductCheckPaths(paths: TriTreeNodeKey[][] | null, checkStrictly: boolean): void {
    this.checkedNodeList = [];
    this.halfCheckedNodeList = [];
    const existsPathList: TriTreeNodeKey[][] = [];
    const calc = (nodes: TriTreeNode[]): void => {
      nodes.forEach(node => {
        if (paths === null) {
          // render tree if no default checked keys found
          node.isChecked = !!node.origin.checked;
        } else {
          // if node is in checked path
          const nodePath = this.getAncestorNodeList(node).map(n => this.getOptionValue(n));
          if (paths.some(keys => arraysEqual(nodePath, keys))) {
            node.isChecked = true;
            node.isHalfChecked = false;
            existsPathList.push(nodePath);
          } else {
            node.isChecked = false;
            node.isHalfChecked = false;
          }
        }
        if (node.children.length > 0) {
          calc(node.children);
        }
      });
    };
    calc(this.rootNodes);
    this.refreshCheckState(checkStrictly);
    // handle missing node
    this.handleMissingNodeList(paths, existsPathList);
  }

  conductSelectedPaths(paths: TriTreeNodeKey[][]): void {
    this.selectedNodeList.forEach(node => (node.isSelected = false));
    this.selectedNodeList = [];
    const existsPathList: TriTreeNodeKey[][] = [];
    const calc = (nodes: TriTreeNode[]): boolean =>
      nodes.every(node => {
        // if node is in selected path
        const nodePath = this.getAncestorNodeList(node).map(n => this.getOptionValue(n));
        if (paths.some(keys => arraysEqual(nodePath, keys))) {
          node.isSelected = true;
          this.setSelectedNodeList(node);
          existsPathList.push(nodePath);
          return false;
        } else {
          node.isSelected = false;
        }
        if (node.children.length > 0) {
          return calc(node.children);
        }
        return true;
      });
    calc(this.rootNodes);
    this.handleMissingNodeList(paths, existsPathList);
  }

  private handleMissingNodeList(paths: TriTreeNodeKey[][] | null, existsPathList: TriTreeNodeKey[][]): void {
    const missingNodeList = this.getMissingNodeList(paths, existsPathList);
    missingNodeList.forEach(node => {
      this.setSelectedNodeList(node);
    });
  }

  private getMissingNodeList(paths: TriTreeNodeKey[][] | null, existsPathList: TriTreeNodeKey[][]): TriTreeNode[] {
    if (!paths) {
      return [];
    }
    return paths
      .filter(path => !existsPathList.some(keys => arraysEqual(path, keys)))
      .map(path => this.createMissingNode(path))
      .filter(isNotNil);
  }

  private createMissingNode(path: TriTreeNodeKey[]): TriTreeNode | null {
    if (!path?.length) {
      return null;
    }

    const createOption = (key: TriTreeNodeKey): TriSafeAny => {
      return {
        [this.fieldNames.value || 'value']: key,
        [this.fieldNames.label || 'label']: key
      };
    };

    let node = new TriTreeNode(createOption(path[0]), null, this);

    for (let i = 1; i < path.length; i++) {
      const childNode = new TriTreeNode(createOption(path[i]));
      node.addChildren([childNode]);
      node = childNode;
    }

    if (this.isMultiple) {
      node.isChecked = true;
      node.isHalfChecked = false;
    } else {
      node.isSelected = true;
    }
    return node;
  }
}
