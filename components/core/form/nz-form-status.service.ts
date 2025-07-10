/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { TriValidateStatus } from 'ng-zorro-antd/core/types';

@Injectable()
export class TriFormStatusService {
  formStatusChanges = new ReplaySubject<{ status: TriValidateStatus; hasFeedback: boolean }>(1);
}
