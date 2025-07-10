/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type TriSplitterLayout = 'horizontal' | 'vertical';
export type TriSplitterCollapsible = boolean | TriSplitterCollapseOption;

export interface TriSplitterCollapseOption {
  start?: boolean;
  end?: boolean;
}
