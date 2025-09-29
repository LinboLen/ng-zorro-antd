/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken, Signal, WritableSignal } from '@angular/core';

import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

import type { TriSpaceCompactItemDirective } from './space-compact-item.directive';

export const TRI_SPACE_COMPACT_SIZE = new InjectionToken<Signal<TriSizeLDSType>>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-space-compact-size' : ''
);
export const TRI_SPACE_COMPACT_ITEMS = new InjectionToken<WritableSignal<TriSpaceCompactItemDirective[]>>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-space-compact-items' : ''
);
export const TRI_SPACE_COMPACT_ITEM_TYPE = new InjectionToken<string>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-space-compact-item-type' : ''
);
