/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriSafeAny } from 'ng-zorro-antd/core/types';

export function isPromise<T>(obj: TriSafeAny): obj is Promise<T> {
  return !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
}
