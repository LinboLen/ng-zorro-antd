/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: '[tri-menu-divider]',
  exportAs: 'triMenuDivider',
  host: {
    class: 'tri-dropdown-menu-item-divider'
  }
})
export class TriMenuDividerDirective {}
