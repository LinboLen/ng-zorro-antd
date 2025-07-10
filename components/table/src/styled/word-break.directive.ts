/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input, booleanAttribute } from '@angular/core';

@Directive({
  selector: '',
  host: {
    '[style.word-break]': `nzBreakWord ? 'break-all' : ''`
  }
})
export class TriCellBreakWordDirective {
  @Input({ transform: booleanAttribute }) breakWord = true;
}
