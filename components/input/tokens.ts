/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';

import { TriInputSearchDirective } from './input-search.directive';
import type { TriInputWrapperComponent } from './input-wrapper.component';

export const TRI_INPUT_WRAPPER = new InjectionToken<TriInputWrapperComponent>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-input-wrapper' : ''
);

export const TRI_INPUT_SEARCH = new InjectionToken<TriInputSearchDirective>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'nz-input-search' : ''
);
