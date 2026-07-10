/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { CandyDate, TriDateAdapter } from 'ng-zorro-antd/core/time';
import { TriI18nPipe } from 'ng-zorro-antd/i18n';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule, TriSelectSizeType } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-calendar-header',
  exportAs: 'triCalendarHeader',
  imports: [FormsModule, TriI18nPipe, TriSelectModule, TriRadioModule, TriStringTemplateOutletDirective],
  encapsulation: ViewEncapsulation.None,
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
          <label tri-radio-button value="month">{{ 'Calendar.lang.month' | nzI18n }}</label>
          <label tri-radio-button value="year">{{ 'Calendar.lang.year' | nzI18n }}</label>
        </tri-radio-group>
      </div>
    }
  `,
  host: {
    class: 'tri-fullcalendar-header',
    '[style.display]': `'block'`
  }
})
export class TriCalendarHeaderComponent implements OnInit, OnChanges {
  private readonly dateAdapter = inject(TriDateAdapter);

  @Input() mode: 'month' | 'year' = 'month';
  @Input({ transform: booleanAttribute }) fullscreen: boolean = true;
  @Input() activeDate = new CandyDate();
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

  constructor() {
    this.dateAdapter.localeChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.setUpYears();
      this.setUpMonths();
    });
  }

  ngOnInit(): void {
    this.setUpYears();
    this.setUpMonths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { activeDate } = changes;
    if (activeDate) {
      if (activeDate.previousValue?.getYear() !== activeDate.currentValue?.getYear()) {
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
      const monthText = this.dateAdapter.format(dateInMonth.nativeDate, 'MMM');
      this.months.push({ label: monthText, value: i });
    }
  }
}
