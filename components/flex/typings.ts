/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type TriJustify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end'
  | 'right'
  | 'left'
  | 'stretch'
  | 'normal';

export type TriAlign =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'start'
  | 'end'
  | 'right'
  | 'left'
  | 'stretch'
  | 'normal';

export type TriGap = 'small' | 'middle' | 'large' | TriCustomGap;
export type TriCustomGap = number | string;

export type TriWrap = 'wrap' | 'nowrap' | 'wrap-reverse';

export type TriFlex = `${TriFlexShrink} ${TriFlexGrow} ${TriFlexBasis}` | 'unset';
export type TriFlexShrink = number;
export type TriFlexGrow = number;
export type TriFlexBasis = string;
