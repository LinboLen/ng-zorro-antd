/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';

import type { TriCheckboxGroupComponent } from './checkbox-group.component';

export const TRI_CHECKBOX_GROUP = new InjectionToken<TriCheckboxGroupComponent>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-checkbox-group' : ''
);
