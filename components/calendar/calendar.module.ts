/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import {
  TriDateCellDirective,
  TriDateFullCellDirective,
  TriMonthCellDirective,
  TriMonthFullCellDirective
} from './calendar-cells';
import { TriCalendarHeaderComponent } from './calendar-header.component';
import { TriCalendarComponent } from './calendar.component';

@NgModule({
  imports: [
    TriCalendarHeaderComponent,
    TriCalendarComponent,
    TriDateCellDirective,
    TriDateFullCellDirective,
    TriMonthCellDirective,
    TriMonthFullCellDirective
  ],
  exports: [
    TriCalendarComponent,
    TriDateCellDirective,
    TriDateFullCellDirective,
    TriMonthCellDirective,
    TriMonthFullCellDirective
  ]
})
export class TriCalendarModule {}
