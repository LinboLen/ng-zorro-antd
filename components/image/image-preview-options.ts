/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';

export class TriImagePreviewOptions {
  keyboard?: boolean = true;
  noAnimation?: boolean = false;
  maskClosable?: boolean = true;
  closeOnNavigation?: boolean = true;
  zIndex?: number;
  zoom?: number;
  rotate?: number;
  flipHorizontally?: boolean;
  flipVertically?: boolean;
  scaleStep?: number;
  direction?: Direction;
}

export interface TriImage {
  src: string;
  srcset?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}
