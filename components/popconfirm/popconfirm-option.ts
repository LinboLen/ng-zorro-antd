/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriButtonType } from 'ng-zorro-antd/button';

export interface TriPopConfirmButton {
  nzType: TriButtonType;
  nzDanger: boolean;
  nzDisabled: boolean;
}

export type TriPopConfirmButtonProps = Partial<TriPopConfirmButton>;
