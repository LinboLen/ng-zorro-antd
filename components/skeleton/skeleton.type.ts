/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type TriSkeletonParagraphWidth = number | string | Array<number | string>;
export type TriSkeletonButtonShape = 'square' | 'circle' | 'round' | 'default';
export type TriSkeletonAvatarShape = 'square' | 'circle';
export type TriSkeletonInputSize = 'large' | 'small' | 'default';
export type TriSkeletonButtonSize = TriSkeletonInputSize;
export type TriSkeletonAvatarSize = TriSkeletonInputSize | number;

export interface TriSkeletonAvatar {
  size?: TriSkeletonAvatarSize;
  shape?: TriSkeletonAvatarShape;
}

export interface TriSkeletonTitle {
  width?: number | string;
}

export interface TriSkeletonParagraph {
  rows?: number;
  width?: TriSkeletonParagraphWidth;
}
