/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DecimalPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DebugElement,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  numberAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { requestAnimationFrame } from 'ng-zorro-antd/core/polyfill';
import { fromEventOutsideAngular, isNotNil } from 'ng-zorro-antd/core/util';
import { DateHelperService, TriI18nModule } from 'ng-zorro-antd/i18n';

import { TimeHolder } from './time-holder';

function makeRange(length: number, step: number = 1, start: number = 0): number[] {
  return new Array(Math.ceil(length / step)).fill(0).map((_, i) => (i + start) * step);
}

export type TriTimePickerUnit = 'hour' | 'minute' | 'second' | '12-hour';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-time-picker-panel',
  exportAs: 'triTimePickerPanel',
  template: `
    @if (inDatePicker) {
      <div class="tri-picker-header">
        <div class="tri-picker-header-view">{{ dateHelper.format($any(time?.value), format) || '&nbsp;' }}</div>
      </div>
    }
    <div class="tri-picker-content">
      @if (hourEnabled) {
        <ul #hourListElement class="tri-picker-time-panel-column" style="position: relative;">
          @for (hour of hourRange; track $index) {
            @if (!(hideDisabledOptions && hour.disabled)) {
              <li
                class="tri-picker-time-panel-cell"
                (click)="selectHour(hour)"
                [class.tri-picker-time-panel-cell-selected]="isSelectedHour(hour)"
                [class.tri-picker-time-panel-cell-disabled]="hour.disabled"
              >
                <div class="tri-picker-time-panel-cell-inner">{{ hour.index | number: '2.0-0' }}</div>
              </li>
            }
          }
        </ul>
      }
      @if (minuteEnabled) {
        <ul #minuteListElement class="tri-picker-time-panel-column" style="position: relative;">
          @for (minute of minuteRange; track $index) {
            @if (!(hideDisabledOptions && minute.disabled)) {
              <li
                class="tri-picker-time-panel-cell"
                (click)="selectMinute(minute)"
                [class.tri-picker-time-panel-cell-selected]="isSelectedMinute(minute)"
                [class.tri-picker-time-panel-cell-disabled]="minute.disabled"
              >
                <div class="tri-picker-time-panel-cell-inner">{{ minute.index | number: '2.0-0' }}</div>
              </li>
            }
          }
        </ul>
      }
      @if (secondEnabled) {
        <ul #secondListElement class="tri-picker-time-panel-column" style="position: relative;">
          @for (second of secondRange; track $index) {
            @if (!(hideDisabledOptions && second.disabled)) {
              <li
                class="tri-picker-time-panel-cell"
                (click)="selectSecond(second)"
                [class.tri-picker-time-panel-cell-selected]="isSelectedSecond(second)"
                [class.tri-picker-time-panel-cell-disabled]="second.disabled"
              >
                <div class="tri-picker-time-panel-cell-inner">{{ second.index | number: '2.0-0' }}</div>
              </li>
            }
          }
        </ul>
      }
      @if (use12Hours) {
        <ul #use12HoursListElement class="tri-picker-time-panel-column" style="position: relative;">
          @for (range of use12HoursRange; track range) {
            <li
              (click)="select12Hours(range)"
              class="tri-picker-time-panel-cell"
              [class.tri-picker-time-panel-cell-selected]="isSelected12Hours(range)"
            >
              <div class="tri-picker-time-panel-cell-inner">{{ range.value }}</div>
            </li>
          }
        </ul>
      }
    </div>
    @if (!inDatePicker) {
      <div class="tri-picker-footer">
        @if (addOn) {
          <div class="tri-picker-footer-extra">
            <ng-template [ngTemplateOutlet]="addOn" />
          </div>
        }
        <ul class="tri-picker-ranges">
          <li class="tri-picker-now">
            <a (click)="onClickNow()">
              {{ nzNowText || ('Calendar.lang.now' | nzI18n) }}
            </a>
          </li>
          <li class="tri-picker-ok">
            <button tri-button type="button" size="small" type="primary" (click)="onClickOk()">
              {{ nzOkText || ('Calendar.lang.ok' | nzI18n) }}
            </button>
          </li>
        </ul>
      </div>
    }
  `,
  host: {
    class: 'tri-picker-time-panel',
    '[class.tri-picker-time-panel-column-0]': `enabledColumns === 0 && !inDatePicker`,
    '[class.tri-picker-time-panel-column-1]': `enabledColumns === 1 && !inDatePicker`,
    '[class.tri-picker-time-panel-column-2]': `enabledColumns === 2 && !inDatePicker`,
    '[class.tri-picker-time-panel-column-3]': `enabledColumns === 3 && !inDatePicker`,
    '[class.tri-picker-time-panel-narrow]': `enabledColumns < 3`,
    '[class.tri-picker-time-panel-placement-bottomLeft]': `!inDatePicker`
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriTimePickerPanelComponent),
      multi: true
    }
  ],
  imports: [DecimalPipe, NgTemplateOutlet, TriI18nModule, TriButtonModule]
})
export class TriTimePickerPanelComponent implements ControlValueAccessor, OnInit, OnChanges {
  dateHelper = inject(DateHelperService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  private _nzHourStep = 1;
  private _nzMinuteStep = 1;
  private _nzSecondStep = 1;
  private onChange?: (value: Date) => void;
  private onTouch?: () => void;
  private _format = 'HH:mm:ss';
  private _disabledHours?: () => number[] = () => [];
  private _disabledMinutes?: (hour: number) => number[] = () => [];
  private _disabledSeconds?: (hour: number, minute: number) => number[] = () => [];
  private _allowEmpty = true;
  time = new TimeHolder();
  hourEnabled = true;
  minuteEnabled = true;
  secondEnabled = true;
  firstScrolled = false;
  enabledColumns = 3;
  hourRange!: ReadonlyArray<{ index: number; disabled: boolean }>;
  minuteRange!: ReadonlyArray<{ index: number; disabled: boolean }>;
  secondRange!: ReadonlyArray<{ index: number; disabled: boolean }>;
  use12HoursRange!: ReadonlyArray<{ index: number; value: string }>;

  @ViewChild('hourListElement', { static: false })
  hourListElement?: DebugElement;
  @ViewChild('minuteListElement', { static: false }) minuteListElement?: DebugElement;
  @ViewChild('secondListElement', { static: false }) secondListElement?: DebugElement;
  @ViewChild('use12HoursListElement', { static: false }) use12HoursListElement?: DebugElement;

  @Input({ transform: booleanAttribute }) inDatePicker: boolean = false; // If inside a date-picker, more diff works need to be done
  @Input() addOn?: TemplateRef<void>;
  @Input() hideDisabledOptions = false;
  @Input() clearText?: string;
  @Input() nowText?: string;
  @Input() okText?: string;
  @Input() placeHolder?: string | null;
  @Input({ transform: booleanAttribute }) use12Hours = false;
  @Input() defaultOpenValue?: Date;

  @Output() readonly closePanel = new EventEmitter<void>();

  @Input({ transform: booleanAttribute })
  set allowEmpty(value: boolean) {
    this._allowEmpty = value;
  }

  get allowEmpty(): boolean {
    return this._allowEmpty;
  }

  @Input()
  set disabledHours(value: undefined | (() => number[])) {
    this._disabledHours = value;
    if (this._disabledHours) {
      this.buildHours();
    }
  }

  get disabledHours(): undefined | (() => number[]) {
    return this._disabledHours;
  }

  @Input()
  set disabledMinutes(value: undefined | ((hour: number) => number[])) {
    if (isNotNil(value)) {
      this._disabledMinutes = value;
      this.buildMinutes();
    }
  }

  get disabledMinutes(): undefined | ((hour: number) => number[]) {
    return this._disabledMinutes;
  }

  @Input()
  set disabledSeconds(value: undefined | ((hour: number, minute: number) => number[])) {
    if (isNotNil(value)) {
      this._disabledSeconds = value;
      this.buildSeconds();
    }
  }

  get disabledSeconds(): undefined | ((hour: number, minute: number) => number[]) {
    return this._disabledSeconds;
  }

  @Input()
  set format(value: string) {
    if (isNotNil(value)) {
      this._format = value;
      this.enabledColumns = 0;
      const charSet = new Set(value);
      this.hourEnabled = charSet.has('H') || charSet.has('h');
      this.minuteEnabled = charSet.has('m');
      this.secondEnabled = charSet.has('s');
      if (this.hourEnabled) {
        this.enabledColumns++;
      }
      if (this.minuteEnabled) {
        this.enabledColumns++;
      }
      if (this.secondEnabled) {
        this.enabledColumns++;
      }
      if (this.use12Hours) {
        this.build12Hours();
      }
    }
  }

  get format(): string {
    return this._format;
  }

  @Input({ transform: numberAttribute })
  set hourStep(value: number) {
    this._nzHourStep = value || 1;
    this.buildHours();
  }

  get hourStep(): number {
    return this._nzHourStep;
  }

  @Input({ transform: numberAttribute })
  set minuteStep(value: number) {
    this._nzMinuteStep = value || 1;
    this.buildMinutes();
  }

  get minuteStep(): number {
    return this._nzMinuteStep;
  }

  @Input({ transform: numberAttribute })
  set secondStep(value: number) {
    this._nzSecondStep = value || 1;
    this.buildSeconds();
  }

  get secondStep(): number {
    return this._nzSecondStep;
  }

  buildHours(): void {
    let hourRanges = 24;
    let disabledHours = this.disabledHours?.();
    let startIndex = 0;
    if (this.use12Hours) {
      hourRanges = 12;
      if (disabledHours) {
        if (this.time.selected12Hours === 'PM') {
          /**
           * Filter and transform hours which greater or equal to 12
           * [0, 1, 2, ..., 12, 13, 14, 15, ..., 23] => [12, 1, 2, 3, ..., 11]
           */
          disabledHours = disabledHours.filter(i => i >= 12).map(i => (i > 12 ? i - 12 : i));
        } else {
          /**
           * Filter and transform hours which less than 12
           * [0, 1, 2, ..., 12, 13, 14, 15, ...23] => [12, 1, 2, 3, ..., 11]
           */
          disabledHours = disabledHours.filter(i => i < 12 || i === 24).map(i => (i === 24 || i === 0 ? 12 : i));
        }
      }
      startIndex = 1;
    }
    this.hourRange = makeRange(hourRanges, this.hourStep, startIndex).map(r => ({
      index: r,
      disabled: !!disabledHours && disabledHours.indexOf(r) !== -1
    }));
    if (this.use12Hours && this.hourRange[this.hourRange.length - 1].index === 12) {
      const temp = [...this.hourRange];
      temp.unshift(temp[temp.length - 1]);
      temp.splice(temp.length - 1, 1);
      this.hourRange = temp;
    }
  }

  buildMinutes(): void {
    this.minuteRange = makeRange(60, this.minuteStep).map(r => ({
      index: r,
      disabled: !!this.disabledMinutes && this.disabledMinutes(this.time.hours!).indexOf(r) !== -1
    }));
  }

  buildSeconds(): void {
    this.secondRange = makeRange(60, this.secondStep).map(r => ({
      index: r,
      disabled:
        !!this.disabledSeconds && this.disabledSeconds(this.time.hours!, this.time.minutes!).indexOf(r) !== -1
    }));
  }

  build12Hours(): void {
    const isUpperFormat = this._format.includes('A');
    this.use12HoursRange = [
      {
        index: 0,
        value: isUpperFormat ? 'AM' : 'am'
      },
      {
        index: 1,
        value: isUpperFormat ? 'PM' : 'pm'
      }
    ];
  }

  buildTimes(): void {
    this.buildHours();
    this.buildMinutes();
    this.buildSeconds();
    this.build12Hours();
  }

  scrollToTime(delay: number = 0): void {
    if (this.hourEnabled && this.hourListElement) {
      this.scrollToSelected(this.hourListElement.nativeElement, this.time.viewHours!, delay, 'hour');
    }
    if (this.minuteEnabled && this.minuteListElement) {
      this.scrollToSelected(this.minuteListElement.nativeElement, this.time.minutes!, delay, 'minute');
    }
    if (this.secondEnabled && this.secondListElement) {
      this.scrollToSelected(this.secondListElement.nativeElement, this.time.seconds!, delay, 'second');
    }
    if (this.use12Hours && this.use12HoursListElement) {
      const selectedHours = this.time.selected12Hours;
      const index = selectedHours === 'AM' ? 0 : 1;
      this.scrollToSelected(this.use12HoursListElement.nativeElement, index, delay, '12-hour');
    }
  }

  selectHour(hour: { index: number; disabled: boolean }): void {
    this.time.setHours(hour.index, hour.disabled);
    if (this._disabledMinutes) {
      this.buildMinutes();
    }
    if (this._disabledSeconds || this._disabledMinutes) {
      this.buildSeconds();
    }
  }

  selectMinute(minute: { index: number; disabled: boolean }): void {
    this.time.setMinutes(minute.index, minute.disabled);
    if (this._disabledSeconds) {
      this.buildSeconds();
    }
  }

  selectSecond(second: { index: number; disabled: boolean }): void {
    this.time.setSeconds(second.index, second.disabled);
  }

  select12Hours(value: { index: number; value: string }): void {
    this.time.setSelected12Hours(value.value);
    if (this._disabledHours) {
      this.buildHours();
    }
    if (this._disabledMinutes) {
      this.buildMinutes();
    }
    if (this._disabledSeconds) {
      this.buildSeconds();
    }
  }

  scrollToSelected(instance: HTMLElement, index: number, duration: number = 0, unit: TriTimePickerUnit): void {
    if (!instance) {
      return;
    }
    const transIndex = this.translateIndex(index, unit);
    const currentOption = (instance.children[transIndex] || instance.children[0]) as HTMLElement;
    this.scrollTo(instance, currentOption.offsetTop, duration);
  }

  translateIndex(index: number, unit: TriTimePickerUnit): number {
    if (unit === 'hour') {
      return this.calcIndex(this.disabledHours?.(), this.hourRange.map(item => item.index).indexOf(index));
    } else if (unit === 'minute') {
      return this.calcIndex(
        this.disabledMinutes?.(this.time.hours!),
        this.minuteRange.map(item => item.index).indexOf(index)
      );
    } else if (unit === 'second') {
      // second
      return this.calcIndex(
        this.disabledSeconds?.(this.time.hours!, this.time.minutes!),
        this.secondRange.map(item => item.index).indexOf(index)
      );
    } else {
      // 12-hour
      return this.calcIndex([], this.use12HoursRange.map(item => item.index).indexOf(index));
    }
  }

  scrollTo(element: HTMLElement, to: number, duration: number): void {
    if (duration <= 0) {
      element.scrollTop = to;
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) {
          return;
        }
        this.scrollTo(element, to, duration - 10);
      });
    });
  }

  calcIndex(array: number[] | undefined, index: number): number {
    if (array?.length && this.hideDisabledOptions) {
      return index - array.reduce((pre, value) => pre + (value < index ? 1 : 0), 0);
    } else {
      return index;
    }
  }

  protected changed(): void {
    if (this.onChange) {
      this.onChange(this.time.value!);
    }
  }

  protected touched(): void {
    if (this.onTouch) {
      this.onTouch();
    }
  }

  timeDisabled(value: Date): boolean {
    const hour = value.getHours();
    const minute = value.getMinutes();
    const second = value.getSeconds();
    return (
      (this.disabledHours?.().indexOf(hour) ?? -1) > -1 ||
      (this.disabledMinutes?.(hour).indexOf(minute) ?? -1) > -1 ||
      (this.disabledSeconds?.(hour, minute).indexOf(second) ?? -1) > -1
    );
  }

  onClickNow(): void {
    const now = new Date();
    if (this.timeDisabled(now)) {
      return;
    }
    this.time.setValue(now);
    this.changed();
    this.closePanel.emit();
  }

  onClickOk(): void {
    this.time.setValue(this.time.value, this.use12Hours);
    this.changed();
    this.closePanel.emit();
  }

  isSelectedHour(hour: { index: number; disabled: boolean }): boolean {
    return hour.index === this.time.viewHours;
  }

  isSelectedMinute(minute: { index: number; disabled: boolean }): boolean {
    return minute.index === this.time.minutes;
  }

  isSelectedSecond(second: { index: number; disabled: boolean }): boolean {
    return second.index === this.time.seconds;
  }

  isSelected12Hours(value: { index: number; value: string }): boolean {
    return value.value.toUpperCase() === this.time.selected12Hours;
  }

  ngOnInit(): void {
    this.time.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.changed();
      this.touched();
      this.scrollToTime(120);
    });
    this.buildTimes();

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.scrollToTime();
        this.firstScrolled = true;
      });
    });

    fromEventOutsideAngular(this.elementRef.nativeElement, 'mousedown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        event.preventDefault();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzUse12Hours, nzDefaultOpenValue } = changes;
    if (!nzUse12Hours?.previousValue && nzUse12Hours?.currentValue) {
      this.build12Hours();
      this.enabledColumns++;
    }
    if (nzDefaultOpenValue?.currentValue) {
      this.time.setDefaultOpenValue(this.defaultOpenValue || new Date());
    }
  }

  writeValue(value: Date): void {
    this.time.setValue(value, this.use12Hours);
    this.buildTimes();

    if (value && this.firstScrolled) {
      this.scrollToTime(120);
    }
    // Mark this component to be checked manually with internal properties changing (see: https://github.com/angular/angular/issues/10816)
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
}
