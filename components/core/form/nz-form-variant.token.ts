/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken, type Signal } from '@angular/core';

import type { TriVariant } from 'ng-zorro-antd/core/types';

export const TRI_FORM_VARIANT = new InjectionToken<Signal<TriVariant>>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-form-variant' : ''
);
