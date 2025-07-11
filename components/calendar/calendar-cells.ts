/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive } from '@angular/core';

@Directive({
  selector: '[triDateCell]',
  exportAs: 'triDateCell'
})
export class TriDateCellDirective {}

@Directive({
  selector: '[triMonthCell]',
  exportAs: 'triMonthCell'
})
export class TriMonthCellDirective {}

@Directive({
  selector: '[triDateFullCell]',
  exportAs: 'triDateFullCell'
})
export class TriDateFullCellDirective {}

@Directive({
  selector: '[triMonthFullCell]',
  exportAs: 'triMonthFullCell'
})
export class TriMonthFullCellDirective {}
