/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Observable } from 'rxjs';

import { TriTreeNode } from 'ng-zorro-antd/core/tree';
import { TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';

import { TriCascaderTreeService } from './cascader-tree.service';

export type TriCascaderExpandTrigger = 'click' | 'hover';
export type TriCascaderTriggerType = 'click' | 'hover';
export type TriCascaderSize = TriSizeLDSType;

export type TriCascaderFilter = (searchValue: string, path: TriCascaderOption[]) => boolean;
export type TriCascaderSorter = (a: TriCascaderOption[], b: TriCascaderOption[], inputValue: string) => number;
export type TriCascaderPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

export interface TriCascaderOption {
  value?: TriSafeAny;
  label?: string;
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  isLeaf?: boolean;
  children?: TriCascaderOption[];
  disableCheckbox?: boolean;

  [key: string]: TriSafeAny;
}

export interface TriShowSearchOptions {
  filter?: TriCascaderFilter;
  sorter?: TriCascaderSorter;
}

export function isShowSearchObject(options: TriShowSearchOptions | boolean): options is TriShowSearchOptions {
  return typeof options !== 'boolean';
}

/**
 * To avoid circular dependency, provide an interface of `NzCascaderComponent`
 * for `NzCascaderService`.
 */
export interface TriCascaderComponentAsSource {
  inputValue: string;
  showSearch: TriShowSearchOptions | boolean;
  labelProperty: string;
  valueProperty: string;
  changeOnSelect: boolean;
  selectedNodes: TriTreeNode[];

  get treeService(): TriCascaderTreeService;

  coerceTreeNodes(value: TriSafeAny[]): TriTreeNode[];

  updateSelectedNodes(): void;

  changeOn?(option: TriCascaderOption, level: number): boolean;

  loadData?(node: TriCascaderOption, index: number): PromiseLike<TriSafeAny> | Observable<TriSafeAny>;
}
