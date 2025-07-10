/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input, booleanAttribute } from '@angular/core';

@Directive({
  selector: '',
  host: {
    '[class.tri-table-cell-ellipsis]': 'ellipsis'
  }
})
export class TriCellEllipsisDirective {
  @Input({ transform: booleanAttribute }) ellipsis = true;
}
