/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, Input, booleanAttribute } from '@angular/core';

@Directive({
  selector: '[tri-card-grid]',
  exportAs: 'triCardGrid',
  host: {
    class: 'tri-card-grid',
    '[class.tri-card-hoverable]': 'hoverable'
  }
})
export class TriCardGridDirective {
  @Input({ transform: booleanAttribute }) hoverable = true;
}
