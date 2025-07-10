/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type TriMark = string | TriMarkObj;

export interface TriMarkObj {
  style?: object;
  label: string;
}

export class TriMarks {
  [key: string]: TriMark;
}

/**
 * Processed steps that would be passed to sub components.
 */
export interface TriExtendedMark {
  value: number;
  offset: number;
  config: TriMark;
}

/**
 * Marks that would be rendered.
 */
export interface TriDisplayedMark extends TriExtendedMark {
  active: boolean;
  label: string;
  style?: object;
}

/**
 * Steps that would be rendered.
 */
export interface TriDisplayedStep extends TriExtendedMark {
  active: boolean;
  style?: object;
}

export type TriSliderShowTooltip = 'always' | 'never' | 'default';

export type TriSliderValue = number[] | number;

export interface TriSliderHandler {
  offset: number | null;
  value: number | null;
  active: boolean;
}
