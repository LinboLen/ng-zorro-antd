/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CandyDate } from 'ng-zorro-antd/core/time';
import { LibPackerModule } from 'ng-zorro-antd/date-picker';
import { TriCalendarI18nInterface, TriI18nService } from 'ng-zorro-antd/i18n';

import {
  TriDateCellDirective,
  TriDateFullCellDirective,
  TriMonthCellDirective,
  TriMonthFullCellDirective
} from './calendar-cells';
import { TriCalendarHeaderComponent } from './calendar-header.component';

export type TriCalendarMode = 'month' | 'year';
type TriCalendarDateTemplate = TemplateRef<{ $implicit: Date }>;

@Component({
  selector: 'tri-calendar',
  exportAs: 'triCalendar',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TriCalendarComponent), multi: true }],
  imports: [TriCalendarHeaderComponent, LibPackerModule],
  template: `
    <tri-calendar-header
      [fullscreen]="fullscreen"
      [activeDate]="activeDate"
      [customHeader]="customHeader"
      [(mode)]="mode"
      (modeChange)="onModeChange($event)"
      (yearChange)="onYearSelect($event)"
      (monthChange)="onMonthSelect($event)"
    />

    <div class="tri-picker-panel">
      <div class="ant-picker-{{ mode === 'month' ? 'date' : 'month' }}-panel">
        <div class="tri-picker-body">
          @if (mode === 'month') {
            <!--  TODO(@wenqi73) [cellRender] [fullCellRender] -->
            <date-table
              [prefixCls]="prefixCls"
              [value]="activeDate"
              [activeDate]="activeDate"
              [locale]="locale"
              [cellRender]="$any(dateCell)"
              [fullCellRender]="$any(dateFullCell)"
              [disabledDate]="disabledDate"
              (valueChange)="onDateSelect($event)"
            />
          } @else {
            <month-table
              [prefixCls]="prefixCls"
              [value]="activeDate"
              [activeDate]="activeDate"
              [locale]="locale"
              [cellRender]="$any(monthCell)"
              [fullCellRender]="$any(monthFullCell)"
              (valueChange)="onDateSelect($event)"
            />
          }
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'tri-picker-calendar',
    '[class.tri-picker-calendar-full]': 'fullscreen',
    '[class.tri-picker-calendar-mini]': '!fullscreen',
    '[class.tri-picker-calendar-rtl]': `dir() === 'rtl'`
  },
  encapsulation: ViewEncapsulation.None
})
export class TriCalendarComponent implements ControlValueAccessor, OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly i18n = inject(TriI18nService);
  protected readonly dir = inject(Directionality).valueSignal;

  locale!: TriCalendarI18nInterface;
  activeDate = new CandyDate();
  prefixCls = 'ant-picker-calendar';

  private onChangeFn: (date: Date) => void = () => {};
  private onTouchFn: () => void = () => {};

  @Input() mode: TriCalendarMode = 'month';
  @Input() value?: Date;
  @Input() disabledDate?: (date: Date) => boolean;

  @Output() readonly modeChange = new EventEmitter<TriCalendarMode>();
  @Output() readonly panelChange = new EventEmitter<{ date: Date; mode: TriCalendarMode }>();
  @Output() readonly selectChange = new EventEmitter<Date>();
  @Output() readonly valueChange = new EventEmitter<Date>();

  /**
   * Cannot use @Input and @ContentChild on one variable
   * because { static: false } will make @Input property get delayed
   **/
  @Input() dateCell?: TriCalendarDateTemplate;
  @ContentChild(TriDateCellDirective, { static: false, read: TemplateRef })
  dateCellChild?: TriCalendarDateTemplate;
  get _dateCell(): TriCalendarDateTemplate {
    return (this.dateCell || this.dateCellChild)!;
  }

  @Input() dateFullCell?: TriCalendarDateTemplate;
  @ContentChild(TriDateFullCellDirective, { static: false, read: TemplateRef })
  dateFullCellChild?: TriCalendarDateTemplate;
  get _dateFullCell(): TriCalendarDateTemplate {
    return (this.dateFullCell || this.dateFullCellChild)!;
  }

  @Input() monthCell?: TriCalendarDateTemplate;
  @ContentChild(TriMonthCellDirective, { static: false, read: TemplateRef })
  monthCellChild?: TriCalendarDateTemplate;
  get _monthCell(): TriCalendarDateTemplate {
    return (this.monthCell || this.monthCellChild)!;
  }

  @Input() monthFullCell?: TriCalendarDateTemplate;
  @ContentChild(TriMonthFullCellDirective, { static: false, read: TemplateRef })
  monthFullCellChild?: TriCalendarDateTemplate;
  get _monthFullCell(): TriCalendarDateTemplate {
    return (this.monthFullCell || this.monthFullCellChild)!;
  }

  @Input() customHeader?: string | TemplateRef<void>;
  @Input({ transform: booleanAttribute }) fullscreen = true;

  constructor() {
    this.i18n.localeChange.pipe(takeUntilDestroyed()).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Calendar', {}).lang;
      this.cdr.markForCheck();
    });
  }

  onModeChange(mode: TriCalendarMode): void {
    this.modeChange.emit(mode);
    this.panelChange.emit({ date: this.activeDate.nativeDate, mode });
  }

  onYearSelect(year: number): void {
    const date = this.activeDate.setYear(year);
    this.updateDate(date);
  }

  onMonthSelect(month: number): void {
    const date = this.activeDate.setMonth(month);
    this.updateDate(date);
  }

  onDateSelect(date: CandyDate): void {
    // Only activeDate is enough in calendar
    // this.value = date;
    this.updateDate(date);
  }

  writeValue(value: Date | null): void {
    this.updateDate(new CandyDate(value as Date), false);
  }

  registerOnChange(fn: (date: Date) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchFn = fn;
  }

  private updateDate(date: CandyDate, touched: boolean = true): void {
    this.activeDate = date;

    if (touched) {
      this.onChangeFn(date.nativeDate);
      this.onTouchFn();
      this.selectChange.emit(date.nativeDate);
      this.valueChange.emit(date.nativeDate);
    }

    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzValue) {
      this.updateDate(new CandyDate(this.value), false);
    }
  }
}
