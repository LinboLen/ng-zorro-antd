/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriSafeAny } from './any';

export type NgClassType = string | string[] | NgClassInterface;

export interface NgClassInterface {
  [klass: string]: TriSafeAny;
}

export interface NgStyleInterface {
  [klass: string]: TriSafeAny;
}
