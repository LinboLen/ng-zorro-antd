/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  numberAttribute,
  signal,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import {
  MouseTouchObserverConfig,
  arraysEqual,
  ensureNumberInRange,
  getElementOffset,
  getPercent,
  getPrecision,
  isNil,
  numberAttributeWithZeroFallback,
  silentEvent
} from 'ng-zorro-antd/core/util';

import { TriSliderHandleComponent } from './handle.component';
import { TriSliderMarksComponent } from './marks.component';
import { TriSliderStepComponent } from './step.component';
import { TriSliderTrackComponent } from './track.component';
import { TriExtendedMark, TriMarks, TriSliderHandler, TriSliderShowTooltip, TriSliderValue } from './typings';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'tri-slider',
  exportAs: 'triSlider',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriSliderComponent),
      multi: true
    }
  ],
  template: `
    <div class="tri-slider-rail"></div>
    <tri-slider-track
      [vertical]="vertical"
      [included]="included"
      [offset]="track.offset!"
      [length]="track.length!"
      [reverse]="reverse"
      [dir]="dir"
    />
    @if (marksArray) {
      <tri-slider-step
        [vertical]="vertical"
        [min]="min"
        [max]="max"
        [lowerBound]="$any(bounds.lower)"
        [upperBound]="$any(bounds.upper)"
        [marksArray]="marksArray"
        [included]="included"
        [reverse]="reverse"
      />
    }
    @for (handle of handles; track handle.value) {
      <tri-slider-handle
        [vertical]="vertical"
        [reverse]="reverse"
        [offset]="handle.offset!"
        [value]="handle.value!"
        [active]="handle.active"
        [tooltipFormatter]="tipFormatter"
        [tooltipVisible]="tooltipVisible"
        [tooltipPlacement]="tooltipPlacement"
        [dragging]="dragging()"
        [dir]="dir"
        (focusin)="onHandleFocusIn($index)"
      />
    }
    @if (marksArray) {
      <tri-slider-marks
        [vertical]="vertical"
        [min]="min"
        [max]="max"
        [lowerBound]="$any(bounds.lower)"
        [upperBound]="$any(bounds.upper)"
        [marksArray]="marksArray"
        [included]="included"
        [reverse]="reverse"
      />
    }
  `,
  imports: [TriSliderTrackComponent, TriSliderStepComponent, TriSliderHandleComponent, TriSliderMarksComponent],
  host: {
    class: 'tri-slider',
    '[class.tri-slider-rtl]': `dir === 'rtl'`,
    '[class.tri-slider-disabled]': 'disabled',
    '[class.tri-slider-vertical]': 'vertical',
    '[class.tri-slider-with-marks]': 'marksArray',
    '(keydown)': 'onKeyDown($event)'
  }
})
export class TriSliderComponent implements ControlValueAccessor, OnInit, OnChanges {
  public slider = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private platform = inject(Platform);
  private directionality = inject(Directionality);

  @ViewChildren(TriSliderHandleComponent) handlerComponents!: QueryList<TriSliderHandleComponent>;

  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) dots: boolean = false;
  @Input({ transform: booleanAttribute }) included: boolean = true;
  @Input({ transform: booleanAttribute }) range: boolean = false;
  @Input({ transform: booleanAttribute }) vertical: boolean = false;
  @Input({ transform: booleanAttribute }) reverse: boolean = false;
  @Input() defaultValue?: TriSliderValue;
  @Input() marks: TriMarks | null = null;
  @Input({ transform: numberAttribute }) max = 100;
  @Input({ transform: numberAttribute }) min = 0;
  @Input({ transform: numberAttributeWithZeroFallback }) step: number = 1;
  @Input() tooltipVisible: TriSliderShowTooltip = 'default';
  @Input() tooltipPlacement: string = 'top';
  @Input() tipFormatter?: null | ((value: number) => string) | TemplateRef<void>;

  @Output() readonly onAfterChange = new EventEmitter<TriSliderValue>();

  value: TriSliderValue | null = null;
  cacheSliderStart: number | null = null;
  cacheSliderLength: number | null = null;
  activeValueIndex: number | undefined = undefined; // Current activated handle's index ONLY for range=true
  track: { offset: null | number; length: null | number } = { offset: null, length: null }; // Track's offset and length
  handles: TriSliderHandler[] = []; // Handles' offset
  marksArray: TriExtendedMark[] | null = null; // "steps" in array type with more data & FILTER out the invalid mark
  bounds: { lower: TriSliderValue | null; upper: TriSliderValue | null } = { lower: null, upper: null }; // now for nz-slider-step
  dir: Direction = 'ltr';

  readonly dragging = signal(false);
  private dragStart$?: Observable<number>;
  private dragMove$?: Observable<number>;
  private dragEnd$?: Observable<Event>;
  private dragStart_?: Subscription | null;
  private dragMove_?: Subscription | null;
  private dragEnd_?: Subscription | null;
  private isNzDisableFirstChange = true;

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
      this.updateTrackAndHandles();
      this.onValueChange(this.getValue(true));
    });

    this.handles = generateHandlers(this.range ? 2 : 1);
    this.marksArray = this.marks ? this.generateMarkItems(this.marks) : null;
    this.bindDraggingHandlers();
    this.toggleDragDisabled(this.disabled);

    if (this.getValue() === null) {
      this.setValue(this.formatValue(null));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDisabled, nzMarks, nzRange } = changes;

    if (nzDisabled && !nzDisabled.firstChange) {
      this.toggleDragDisabled(nzDisabled.currentValue);
    } else if (nzMarks && !nzMarks.firstChange) {
      this.marksArray = this.marks ? this.generateMarkItems(this.marks) : null;
    } else if (nzRange && !nzRange.firstChange) {
      this.handles = generateHandlers(nzRange.currentValue ? 2 : 1);
      this.setValue(this.formatValue(null));
    }
  }

  writeValue(val: TriSliderValue | null): void {
    this.setValue(val, true);
  }

  onValueChange(_value: TriSliderValue): void {}

  onTouched(): void {}

  registerOnChange(fn: (value: TriSliderValue) => void): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    this.toggleDragDisabled(this.disabled);
    this.cdr.markForCheck();
  }

  /**
   * Event handler is only triggered when a slider handler is focused.
   */
  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    const code = e.keyCode;
    const isIncrease = code === RIGHT_ARROW || code === UP_ARROW;
    const isDecrease = code === LEFT_ARROW || code === DOWN_ARROW;

    if (!(isIncrease || isDecrease)) {
      return;
    }

    e.preventDefault();

    const step = (isDecrease ? -this.step : this.step) * (this.reverse ? -1 : 1) * (this.dir === 'rtl' ? -1 : 1);
    const newVal = this.range
      ? (this.value as number[])[this.activeValueIndex!] + step
      : (this.value as number) + step;
    this.setActiveValue(ensureNumberInRange(newVal, this.min, this.max));
    this.onAfterChange.emit(this.getValue(true));
  }

  onHandleFocusIn(index: number): void {
    this.activeValueIndex = index;
  }

  private setValue(value: TriSliderValue | null, isWriteValue: boolean = false): void {
    if (isWriteValue) {
      this.value = this.formatValue(value);
      this.updateTrackAndHandles();
    } else if (!valuesEqual(this.value!, value!)) {
      this.value = value;
      this.updateTrackAndHandles();
      this.onValueChange(this.getValue(true));
    }
  }

  private getValue(cloneAndSort: boolean = false): TriSliderValue {
    if (cloneAndSort && this.value && isValueRange(this.value)) {
      return [...this.value].sort((a, b) => a - b);
    }
    return this.value!;
  }

  /**
   * Clone & sort current value and convert them to offsets, then return the new one.
   */
  private getValueToOffset(value?: TriSliderValue): TriSliderValue {
    let normalizedValue = value;

    if (typeof normalizedValue === 'undefined') {
      normalizedValue = this.getValue(true);
    }

    return isValueRange(normalizedValue)
      ? normalizedValue.map(val => this.valueToOffset(val))
      : this.valueToOffset(normalizedValue);
  }

  /**
   * Find the closest value to be activated.
   */
  private setActiveValueIndex(pointerValue: number): void {
    const value = this.getValue();
    if (isValueRange(value)) {
      let minimal: number | null = null;
      let gap: number;
      let activeIndex = -1;
      value.forEach((val, index) => {
        gap = Math.abs(pointerValue - val);
        if (minimal === null || gap < minimal!) {
          minimal = gap;
          activeIndex = index;
        }
      });
      this.activeValueIndex = activeIndex;
      this.handlerComponents.toArray()[activeIndex].focus();
    } else {
      this.handlerComponents.toArray()[0].focus();
    }
  }

  private setActiveValue(pointerValue: number): void {
    if (isValueRange(this.value!)) {
      const newValue = [...this.value];
      newValue[this.activeValueIndex!] = pointerValue;
      this.setValue(newValue);
    } else {
      this.setValue(pointerValue);
    }
  }

  /**
   * Update track and handles' position and length.
   */
  private updateTrackAndHandles(): void {
    const value = this.getValue();
    const offset = this.getValueToOffset(value);
    const valueSorted = this.getValue(true);
    const offsetSorted = this.getValueToOffset(valueSorted);
    const boundParts = isValueRange(valueSorted) ? valueSorted : [0, valueSorted];
    const trackParts = isValueRange(offsetSorted)
      ? [offsetSorted[0], offsetSorted[1] - offsetSorted[0]]
      : [0, offsetSorted];

    this.handles.forEach((handle, index) => {
      handle.offset = isValueRange(offset) ? offset[index] : offset;
      handle.value = isValueRange(value) ? value[index] : value || 0;
    });

    [this.bounds.lower, this.bounds.upper] = boundParts;
    [this.track.offset, this.track.length] = trackParts;

    this.cdr.markForCheck();
  }

  private onDragStart(value: number): void {
    this.toggleDragMoving(true);
    this.cacheSliderProperty();
    this.setActiveValueIndex(this.getLogicalValue(value));
    this.setActiveValue(this.getLogicalValue(value));
    this.showHandleTooltip(this.range ? this.activeValueIndex : 0);
  }

  private onDragMove(value: number): void {
    this.setActiveValue(this.getLogicalValue(value));
    this.cdr.markForCheck();
  }

  private getLogicalValue(value: number): number {
    if (this.reverse) {
      if (!this.vertical && this.dir === 'rtl') {
        return value;
      }
      return this.max - value + this.min;
    }
    if (!this.vertical && this.dir === 'rtl') {
      return this.max - value + this.min;
    }

    return value;
  }

  private onDragEnd(): void {
    this.onAfterChange.emit(this.getValue(true));
    this.toggleDragMoving(false);
    this.cacheSliderProperty(true);
    this.hideAllHandleTooltip();
    this.cdr.markForCheck();
  }

  /**
   * Create user interactions handles.
   */
  private bindDraggingHandlers(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    const pluckFunc: (keys: string[]) => (event: Event) => number = keys => (event: Event) =>
      keys.reduce((acc: TriSafeAny, key: string) => acc[key] || acc, event);
    const sliderDOM: HTMLElement = this.slider.nativeElement;
    const orientField = this.vertical ? 'pageY' : 'pageX';
    const mouse: MouseTouchObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      pluckKey: [orientField]
    };
    const touch: MouseTouchObserverConfig = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      pluckKey: ['touches', '0', orientField],
      filter: (e: MouseEvent | TouchEvent) => e instanceof TouchEvent
    };

    [mouse, touch].forEach(source => {
      const { start, move, end, pluckKey, filter: filterFunc = () => true } = source;

      source.startPlucked$ = fromEvent(sliderDOM, start).pipe(
        filter(filterFunc),
        tap(silentEvent),
        map(pluckFunc(pluckKey)),
        map((position: number) => this.findClosestValue(position))
      );
      source.end$ = fromEvent(document, end);
      source.moveResolved$ = fromEvent(document, move).pipe(
        filter(filterFunc),
        tap(silentEvent),
        map(pluckFunc(pluckKey)),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        distinctUntilChanged(),
        takeUntil(source.end$)
      );
    });

    this.dragStart$ = merge(mouse.startPlucked$!, touch.startPlucked$!);
    this.dragMove$ = merge(mouse.moveResolved$!, touch.moveResolved$!);
    this.dragEnd$ = merge(mouse.end$!, touch.end$!);
  }

  private subscribeDrag(periods: string[] = ['start', 'move', 'end']): void {
    if (periods.indexOf('start') !== -1 && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(this.onDragStart.bind(this));
    }

    if (periods.indexOf('move') !== -1 && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.onDragMove.bind(this));
    }

    if (periods.indexOf('end') !== -1 && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.onDragEnd.bind(this));
    }
  }

  private unsubscribeDrag(periods: string[] = ['start', 'move', 'end']): void {
    if (periods.includes('start')) {
      this.dragStart_?.unsubscribe();
      this.dragStart_ = null;
    }

    if (periods.includes('move')) {
      this.dragMove_?.unsubscribe();
      this.dragMove_ = null;
    }

    if (periods.includes('end')) {
      this.dragEnd_?.unsubscribe();
      this.dragEnd_ = null;
    }
  }

  private toggleDragMoving(movable: boolean): void {
    const periods = ['move', 'end'];
    if (movable) {
      this.dragging.set(true);
      this.subscribeDrag(periods);
    } else {
      this.dragging.set(false);
      this.unsubscribeDrag(periods);
    }
  }

  private toggleDragDisabled(disabled: boolean): void {
    if (disabled) {
      this.unsubscribeDrag();
    } else {
      this.subscribeDrag(['start']);
    }
  }

  private findClosestValue(position: number): number {
    const sliderStart = this.getSliderStartPosition();
    const sliderLength = this.getSliderLength();
    const ratio = ensureNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const val = (this.max - this.min) * (this.vertical ? 1 - ratio : ratio) + this.min;
    const points =
      this.marks === null
        ? []
        : Object.keys(this.marks)
            .map(parseFloat)
            .sort((a, b) => a - b);

    if (this.step !== 0 && !this.dots) {
      const closestOne = Math.round(val / this.step) * this.step;
      points.push(closestOne);
    }

    const gaps = points.map(point => Math.abs(val - point));
    const closest = points[gaps.indexOf(Math.min(...gaps))];

    return this.step === 0 ? closest : parseFloat(closest.toFixed(getPrecision(this.step)));
  }

  private valueToOffset(value: number): number {
    return getPercent(this.min, this.max, value);
  }

  private getSliderStartPosition(): number {
    if (this.cacheSliderStart !== null) {
      return this.cacheSliderStart;
    }
    const offset = getElementOffset(this.slider.nativeElement);
    return this.vertical ? offset.top : offset.left;
  }

  private getSliderLength(): number {
    if (this.cacheSliderLength !== null) {
      return this.cacheSliderLength;
    }
    const sliderDOM = this.slider.nativeElement;
    return this.vertical ? sliderDOM.clientHeight : sliderDOM.clientWidth;
  }

  /**
   * Cache DOM layout/reflow operations for performance (may not necessary?)
   */
  private cacheSliderProperty(remove: boolean = false): void {
    this.cacheSliderStart = remove ? null : this.getSliderStartPosition();
    this.cacheSliderLength = remove ? null : this.getSliderLength();
  }

  private formatValue(value: TriSliderValue | null): TriSliderValue {
    if (isNil(value)) {
      return this.range ? [this.min, this.max] : this.min;
    } else if (assertValueValid(value, this.range)) {
      return isValueRange(value)
        ? value.map(val => ensureNumberInRange(val, this.min, this.max))
        : ensureNumberInRange(value, this.min, this.max);
    } else {
      return this.defaultValue ? this.defaultValue : this.range ? [this.min, this.max] : this.min;
    }
  }

  /**
   * Show one handle's tooltip and hide others'.
   */
  private showHandleTooltip(handleIndex: number = 0): void {
    this.handles.forEach((handle, index) => (handle.active = index === handleIndex));
  }

  private hideAllHandleTooltip(): void {
    this.handles.forEach(handle => (handle.active = false));
  }

  private generateMarkItems(marks: TriMarks): TriExtendedMark[] | null {
    const marksArray: TriExtendedMark[] = [];
    for (const key in marks) {
      if (marks.hasOwnProperty(key)) {
        const mark = marks[key];
        const val = typeof key === 'number' ? key : parseFloat(key);
        if (val >= this.min && val <= this.max) {
          marksArray.push({ value: val, offset: this.valueToOffset(val), config: mark });
        }
      }
    }
    return marksArray.length ? marksArray : null;
  }
}

function getValueTypeNotMatchError(): Error {
  return new Error(
    `The "nzRange" can't match the "ngModel"'s type, please check these properties: "nzRange", "ngModel", "nzDefaultValue".`
  );
}

function isValueRange(value: TriSliderValue): value is number[] {
  if (value instanceof Array) {
    return value.length === 2;
  } else {
    return false;
  }
}

function generateHandlers(amount: number): TriSliderHandler[] {
  return Array(amount)
    .fill(0)
    .map(() => ({ offset: null, value: null, active: false }));
}

/**
 * Check if value is valid and throw error if value-type/range not match.
 */
function assertValueValid(value: TriSliderValue, isRange?: boolean): boolean {
  if ((!isValueRange(value) && isNaN(value)) || (isValueRange(value) && value.some(v => isNaN(v)))) {
    return false;
  }
  return assertValueTypeMatch(value, isRange);
}

/**
 * Assert that if `this.nzRange` is `true`, value is also a range, vice versa.
 */
function assertValueTypeMatch(value: TriSliderValue, isRange: boolean = false): boolean {
  if (isValueRange(value) !== isRange) {
    throw getValueTypeNotMatchError();
  }
  return true;
}

function valuesEqual(valA: TriSliderValue, valB: TriSliderValue): boolean {
  if (typeof valA !== typeof valB) {
    return false;
  }
  return isValueRange(valA) && isValueRange(valB) ? arraysEqual<number>(valA, valB) : valA === valB;
}
