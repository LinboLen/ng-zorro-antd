/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CandyDate } from 'ng-zorro-antd/core/time';
import { FunctionProp } from 'ng-zorro-antd/core/types';
import { TriCalendarI18nInterface } from 'ng-zorro-antd/i18n';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

import { LibPackerModule } from './lib';
import { DisabledDateFn, TriDateMode, TriPanelChangeType, RangePartType, SupportTimeOptions } from './standard-types';
import { PREFIX_CLASS } from './util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class.tri-picker-datetime-panel]="showTimePicker">
      <div class="{{ prefixCls }}-{{ panelMode }}-panel">
        @switch (panelMode) {
          @case ('decade') {
            <decade-header
              [(value)]="activeDate"
              [locale]="locale"
              [showSuperPreBtn]="enablePrevNext('prev', 'decade')"
              [showSuperNextBtn]="enablePrevNext('next', 'decade')"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelChange)="panelChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            />
            <div class="{{ prefixCls }}-body">
              <decade-table
                [activeDate]="activeDate"
                [value]="value"
                [locale]="locale"
                (valueChange)="onChooseDecade($event)"
                [disabledDate]="disabledDate"
              />
            </div>
          }
          @case ('year') {
            <year-header
              [(value)]="activeDate"
              [locale]="locale"
              [showSuperPreBtn]="enablePrevNext('prev', 'year')"
              [showSuperNextBtn]="enablePrevNext('next', 'year')"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelChange)="panelChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            />
            <div class="{{ prefixCls }}-body">
              <year-table
                [activeDate]="activeDate"
                [value]="value"
                [locale]="locale"
                [disabledDate]="disabledDate"
                [selectedValue]="selectedValue"
                [hoverValue]="hoverValue"
                (valueChange)="onChooseYear($event)"
                (cellHover)="cellHover.emit($event)"
              />
            </div>
          }
          @case ('month') {
            <month-header
              [(value)]="activeDate"
              [locale]="locale"
              [showSuperPreBtn]="enablePrevNext('prev', 'month')"
              [showSuperNextBtn]="enablePrevNext('next', 'month')"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelChange)="panelChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            />
            <div class="{{ prefixCls }}-body">
              <month-table
                [value]="value"
                [activeDate]="activeDate"
                [locale]="locale"
                [disabledDate]="disabledDate"
                [selectedValue]="selectedValue"
                [hoverValue]="hoverValue"
                (valueChange)="onChooseMonth($event)"
                (cellHover)="cellHover.emit($event)"
              />
            </div>
          }
          @case ('quarter') {
            <quarter-header
              [(value)]="activeDate"
              [locale]="locale"
              [showSuperPreBtn]="enablePrevNext('prev', 'month')"
              [showSuperNextBtn]="enablePrevNext('next', 'month')"
              [showNextBtn]="false"
              [showPreBtn]="false"
              (panelChange)="panelChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            />
            <div class="{{ prefixCls }}-body">
              <quarter-table
                [value]="value"
                [activeDate]="activeDate"
                [locale]="locale"
                [disabledDate]="disabledDate"
                [selectedValue]="selectedValue"
                [hoverValue]="hoverValue"
                (valueChange)="onChooseQuarter($event)"
                (cellHover)="cellHover.emit($event)"
                [cellRender]="dateRender"
              />
            </div>
          }
          @default {
            <date-header
              [(value)]="activeDate"
              [locale]="locale"
              [showSuperPreBtn]="panelMode === 'week' ? enablePrevNext('prev', 'week') : enablePrevNext('prev', 'date')"
              [showSuperNextBtn]="
                panelMode === 'week' ? enablePrevNext('next', 'week') : enablePrevNext('next', 'date')
              "
              [showPreBtn]="panelMode === 'week' ? enablePrevNext('prev', 'week') : enablePrevNext('prev', 'date')"
              [showNextBtn]="panelMode === 'week' ? enablePrevNext('next', 'week') : enablePrevNext('next', 'date')"
              (panelChange)="panelChange.emit($event)"
              (valueChange)="headerChange.emit($event)"
            />
            <div class="{{ prefixCls }}-body">
              <date-table
                [locale]="locale"
                [showWeek]="showWeek"
                [value]="value"
                [activeDate]="activeDate"
                [disabledDate]="disabledDate"
                [cellRender]="dateRender"
                [selectedValue]="selectedValue"
                [hoverValue]="hoverValue"
                [canSelectWeek]="panelMode === 'week'"
                [format]="format"
                (valueChange)="onSelectDate($event)"
                (cellHover)="cellHover.emit($event)"
              />
            </div>
          }
        }
      </div>
      @if (showTimePicker && timeOptions) {
        <tri-time-picker-panel
          [inDatePicker]="true"
          [ngModel]="value?.nativeDate"
          (ngModelChange)="onSelectTime($event)"
          [format]="$any(format)"
          [hourStep]="$any(hourStep)"
          [minuteStep]="$any(minuteStep)"
          [secondStep]="$any(secondStep)"
          [disabledHours]="$any(disabledHours)"
          [disabledMinutes]="$any(disabledMinutes)"
          [disabledSeconds]="$any(disabledSeconds)"
          [hideDisabledOptions]="!!hideDisabledOptions"
          [defaultOpenValue]="$any(defaultOpenValue)"
          [use12Hours]="!!use12Hours"
          [addOn]="$any(addOn)"
        />
      }
    </div>
  `,
  imports: [LibPackerModule, TriTimePickerModule, FormsModule]
})
export class InnerPopupComponent implements OnChanges {
  @Input() activeDate!: CandyDate;
  @Input() endPanelMode!: TriDateMode;
  @Input() panelMode!: TriDateMode;
  @Input({ transform: booleanAttribute }) showWeek!: boolean;
  @Input() locale!: TriCalendarI18nInterface;
  @Input({ transform: booleanAttribute }) showTimePicker!: boolean;
  @Input() timeOptions!: SupportTimeOptions | null;
  @Input() disabledDate?: DisabledDateFn;
  @Input() dateRender?: string | TemplateRef<Date> | FunctionProp<TemplateRef<Date> | string>;
  @Input() selectedValue!: CandyDate[]; // Range ONLY
  @Input() hoverValue!: CandyDate[]; // Range ONLY
  @Input() value!: CandyDate;
  @Input() partType!: RangePartType;
  @Input() format?: string;

  @Output() readonly panelChange = new EventEmitter<TriPanelChangeType>();
  // TODO: name is not proper
  @Output() readonly headerChange = new EventEmitter<CandyDate>(); // Emitted when user changed the header's value
  @Output() readonly selectDate = new EventEmitter<CandyDate>(); // Emitted when the date is selected by click the date panel
  @Output() readonly selectTime = new EventEmitter<CandyDate>();
  @Output() readonly cellHover = new EventEmitter<CandyDate>(); // Emitted when hover on a day by mouse enter

  prefixCls: string = PREFIX_CLASS;

  /**
   * Hide "next" arrow in left panel,
   * hide "prev" arrow in right panel
   *
   * @param direction
   * @param panelMode
   */
  enablePrevNext(direction: 'prev' | 'next', panelMode: TriDateMode): boolean {
    return !(
      !this.showTimePicker &&
      panelMode === this.endPanelMode &&
      ((this.partType === 'left' && direction === 'next') || (this.partType === 'right' && direction === 'prev'))
    );
  }

  onSelectTime(date: Date): void {
    this.selectTime.emit(new CandyDate(date));
  }

  // The value real changed to outside
  onSelectDate(date: CandyDate | Date): void {
    const value = date instanceof CandyDate ? date : new CandyDate(date);
    const timeValue = this.timeOptions && this.timeOptions.nzDefaultOpenValue;

    // Display timeValue when value is null
    if (!this.value && timeValue) {
      value.setHms(timeValue.getHours(), timeValue.getMinutes(), timeValue.getSeconds());
    }

    this.selectDate.emit(value);
  }

  onChooseMonth(value: CandyDate): void {
    this.activeDate = this.activeDate.setMonth(value.getMonth());
    if (this.endPanelMode === 'month') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.headerChange.emit(value);
      this.panelChange.emit({ mode: this.endPanelMode, date: value.nativeDate });
    }
  }

  onChooseQuarter(value: CandyDate): void {
    this.activeDate = this.activeDate.setQuarter(value.getQuarter());
    this.value = value;
    this.selectDate.emit(value);
  }

  onChooseYear(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear());
    if (this.endPanelMode === 'year') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.headerChange.emit(value);
      this.panelChange.emit({ mode: this.endPanelMode, date: value.nativeDate });
    }
  }

  onChooseDecade(value: CandyDate): void {
    this.activeDate = this.activeDate.setYear(value.getYear());
    if (this.endPanelMode === 'decade') {
      this.value = value;
      this.selectDate.emit(value);
    } else {
      this.headerChange.emit(value);
      this.panelChange.emit({ mode: 'year', date: value.nativeDate });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.activeDate && !changes.activeDate.currentValue) {
      this.activeDate = new CandyDate();
    }
    // New Antd vesion has merged 'date' ant 'time' to one panel,
    // So there is not 'time' panel
    if (changes.panelMode && changes.panelMode.currentValue === 'time') {
      this.panelMode = 'date';
    }
  }
}
