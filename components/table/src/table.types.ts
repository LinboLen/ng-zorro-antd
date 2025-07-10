/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriSafeAny } from 'ng-zorro-antd/core/types';

export type TriTableLayout = 'fixed' | 'auto';
export type TriTablePaginationPosition = 'top' | 'bottom' | 'both';
export type TriTablePaginationType = 'default' | 'small';
export type TriTableSize = 'middle' | 'default' | 'small';
export type TriTableFilterList = Array<{ text: string; value: TriSafeAny; byDefault?: boolean }>;
export type TriTableSortOrder = string | 'ascend' | 'descend' | null;
export type TriTableSortFn<T = unknown> = (a: T, b: T, sortOrder?: TriTableSortOrder) => number;
export type TriTableFilterValue = TriSafeAny[] | TriSafeAny;
export type TriTableFilterFn<T = unknown> = (value: TriTableFilterValue, data: T) => boolean;

export interface TriTableQueryParams {
  pageIndex: number;
  pageSize: number;
  sort: Array<{ key: string; value: TriTableSortOrder }>;
  filter: Array<{ key: string; value: TriTableFilterValue }>;
}

export interface TriCustomColumn {
  value: string;
  default: boolean;
  width: number;
  fixWidth?: boolean;
}

export type TriTableSummaryFixedType = 'top' | 'bottom';
