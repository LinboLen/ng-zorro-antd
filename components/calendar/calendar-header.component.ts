/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { CandyDate } from 'ng-zorro-antd/core/time';
import { DateHelperService, TriI18nService } from 'ng-zorro-antd/i18n';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule, TriSelectSizeType } from 'ng-zorro-antd/select';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '',
  exportAs: 'triCalendarHeader',
  template: `
    @if (customHeader) {
      <ng-container *stringTemplateOutlet="customHeader">{{ customHeader }}</ng-container>
    } @else {
      <div class="tri-picker-calendar-header">
        <tri-select
          class="tri-picker-calendar-year-select"
          [size]="size"
          [dropdownMatchSelectWidth]="false"
          [ngModel]="activeYear"
          (ngModelChange)="updateYear($event)"
        >
          @for (year of years; track year.value) {
            <tri-option [label]="year.label" [value]="year.value" />
          }
        </tri-select>

        @if (mode === 'month') {
          <tri-select
            class="tri-picker-calendar-month-select"
            [size]="size"
            [dropdownMatchSelectWidth]="false"
            [ngModel]="activeMonth"
            (ngModelChange)="monthChange.emit($event)"
          >
            @for (month of months; track month.value) {
              <tri-option [label]="month.label" [value]="month.value" />
            }
          </tri-select>
        }

        <tri-radio-group
          class="tri-picker-calendar-mode-switch"
          [(ngModel)]="mode"
          (ngModelChange)="modeChange.emit($event)"
          [size]="size"
        >
          <label tri-radio-button value="month">{{ monthTypeText }}</label>
          <label tri-radio-button value="year">{{ yearTypeText }}</label>
        </tri-radio-group>
      </div>
    }
  `,
  host: {
    class: 'tri-fullcalendar-header',
    '[style.display]': `'block'`
  },
  imports: [TriSelectModule, FormsModule, TriRadioModule, TriStringTemplateOutletDirective]
})
export class TriCalendarHeaderComponent implements OnInit, OnChanges {
  private readonly dateHelper = inject(DateHelperService);
  private readonly i18n = inject(TriI18nService);

  @Input() mode: 'month' | 'year' = 'month';
  @Input({ transform: booleanAttribute }) fullscreen: boolean = true;
  @Input() activeDate: CandyDate = new CandyDate();
  @Input() customHeader?: string | TemplateRef<void>;

  @Output() readonly modeChange = new EventEmitter<'month' | 'year'>();
  @Output() readonly yearChange = new EventEmitter<number>();
  @Output() readonly monthChange = new EventEmitter<number>();

  yearOffset: number = 10;
  yearTotal: number = 20;
  years: Array<{ label: string; value: number }> = [];
  months: Array<{ label: string; value: number }> = [];

  get activeYear(): number {
    return this.activeDate.getYear();
  }

  get activeMonth(): number {
    return this.activeDate.getMonth();
  }

  get size(): TriSelectSizeType {
    return this.fullscreen ? 'default' : 'small';
  }

  get yearTypeText(): string {
    return this.i18n.getLocale().Calendar.lang.year;
  }

  get monthTypeText(): string {
    return this.i18n.getLocale().Calendar.lang.month;
  }

  ngOnInit(): void {
    this.setUpYears();
    this.setUpMonths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeDate']) {
      const previousActiveDate = changes['activeDate'].previousValue as CandyDate;
      const currentActiveDate = changes['activeDate'].currentValue as CandyDate;
      if (previousActiveDate?.getYear() !== currentActiveDate?.getYear()) {
        this.setUpYears();
      }
    }
  }

  updateYear(year: number): void {
    this.yearChange.emit(year);
    this.setUpYears(year);
  }

  private setUpYears(year?: number): void {
    const start = (year || this.activeYear) - this.yearOffset;
    const end = start + this.yearTotal;

    this.years = [];
    for (let i = start; i < end; i++) {
      this.years.push({ label: `${i}`, value: i });
    }
  }

  private setUpMonths(): void {
    this.months = [];

    for (let i = 0; i < 12; i++) {
      const dateInMonth = this.activeDate.setMonth(i);
      const monthText = this.dateHelper.format(dateInMonth.nativeDate, 'MMM');
      this.months.push({ label: monthText, value: i });
    }
  }
}
