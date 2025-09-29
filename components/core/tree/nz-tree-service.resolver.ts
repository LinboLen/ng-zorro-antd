/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';

import { TriTreeBaseService } from './nz-tree-base.service';

export const TriTreeHigherOrderServiceToken = new InjectionToken<TriTreeBaseService>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-tree-higher-order' : ''
);
