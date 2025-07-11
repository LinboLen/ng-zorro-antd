/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, inject } from '@angular/core';

import { TriTableStyleService } from '../table-style.service';

@Directive({
  selector: 'th:not(.nz-disable-th),td:not(.nz-disable-td)',
  host: {
    '[class.tri-table-cell]': 'isInsideTable'
  }
})
export class TriTableCellDirective {
  isInsideTable = !!inject(TriTableStyleService, { optional: true });
}
