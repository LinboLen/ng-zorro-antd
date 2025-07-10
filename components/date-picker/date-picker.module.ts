/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { CalendarFooterComponent } from './calendar-footer.component';
import { TriDatePickerComponent } from './date-picker.component';
import { DateRangePopupComponent } from './date-range-popup.component';
import { InnerPopupComponent } from './inner-popup.component';
import { TriMonthPickerComponent } from './month-picker.component';
import { TriQuarterPickerComponent } from './quarter-picker.component';
import { TriRangePickerComponent } from './range-picker.component';
import { TriWeekPickerComponent } from './week-picker.component';
import { TriYearPickerComponent } from './year-picker.component';

@NgModule({
  imports: [
    TriDatePickerComponent,
    TriMonthPickerComponent,
    TriYearPickerComponent,
    TriWeekPickerComponent,
    TriRangePickerComponent,
    CalendarFooterComponent,
    InnerPopupComponent,
    DateRangePopupComponent,
    TriQuarterPickerComponent
  ],
  exports: [
    TriDatePickerComponent,
    TriRangePickerComponent,
    TriMonthPickerComponent,
    TriYearPickerComponent,
    TriWeekPickerComponent,
    TriQuarterPickerComponent
  ]
})
export class TriDatePickerModule {}
