/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import type { TriShapeSCType } from 'ng-zorro-antd/core/types';

import type { TriAvatarSize } from './avatar.component';

export interface TriAvatarProps {
  shape?: TriShapeSCType;
  size?: TriAvatarSize;
  gap?: number;
  src?: string;
  srcSet?: string;
  alt?: string;
  icon?: string;
  text?: string;
  error?: (event: Event) => void;
}
