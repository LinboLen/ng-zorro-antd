/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  NgZone,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  signal,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriDestroyService } from 'ng-zorro-antd/core/services';
import {
  NgClassInterface,
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  OnChangeType,
  OnTouchedType
} from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, getStatusClassNames, isNotNil } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { NZ_SPACE_COMPACT_ITEM_TYPE, NZ_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

/**
 * @deprecated Will be removed in v21. It is recommended to use the new version `<nz-input-number>`.
 */
@Component({
  selector: '',
  exportAs: 'triInputNumber',
  template: `
    <div class="tri-input-number-handler-wrap">
      <span
        #upHandler
        unselectable="unselectable"
        class="tri-input-number-handler tri-input-number-handler-up"
        (mousedown)="up($event)"
        [class.tri-input-number-handler-up-disabled]="disabledUp"
      >
        <tri-icon type="up" class="tri-input-number-handler-up-inner" />
      </span>
      <span
        #downHandler
        unselectable="unselectable"
        class="tri-input-number-handler tri-input-number-handler-down"
        (mousedown)="down($event)"
        [class.tri-input-number-handler-down-disabled]="disabledDown"
      >
        <tri-icon type="down" class="tri-input-number-handler-down-inner" />
      </span>
    </div>
    <div class="tri-input-number-input-wrap">
      <input
        #inputElement
        autocomplete="off"
        class="tri-input-number-input"
        [attr.id]="id"
        [attr.autofocus]="autoFocus ? 'autofocus' : null"
        [disabled]="disabled"
        [attr.min]="min"
        [attr.max]="max"
        [placeholder]="placeHolder"
        [attr.step]="step"
        [readOnly]="readOnly"
        [attr.inputmode]="inputMode"
        [ngModel]="displayValue"
        (ngModelChange)="onModelChange($event)"
      />
    </div>
    @if (hasFeedback && !!status && !formNoStatusService) {
      <tri-form-item-feedback-icon class="tri-input-number-suffix" [status]="status" />
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriInputNumberLegacyComponent),
      multi: true
    },
    { provide: NZ_SPACE_COMPACT_ITEM_TYPE, useValue: 'input-number' },
    TriDestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-input-number',
    '[class.tri-input-number-in-form-item]': '!!formStatusService',
    '[class.tri-input-number-focused]': 'isFocused',
    '[class.tri-input-number-lg]': `finalSize() === 'large'`,
    '[class.tri-input-number-sm]': `finalSize() === 'small'`,
    '[class.tri-input-number-disabled]': 'disabled',
    '[class.tri-input-number-readonly]': 'readOnly',
    '[class.tri-input-number-rtl]': `dir === 'rtl'`,
    '[class.tri-input-number-borderless]': `borderless`
  },
  imports: [TriIconModule, FormsModule, TriFormItemFeedbackIconComponent],
  hostDirectives: [TriSpaceCompactItemDirective]
})
export class TriInputNumberLegacyComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnInit, OnDestroy {
  displayValue?: string | number;
  isFocused = false;
  disabled$ = new Subject<boolean>();
  disabledUp = false;
  disabledDown = false;
  dir: Direction = 'ltr';
  // status
  prefixCls: string = 'ant-input-number';
  _status: TriValidateStatus = '';
  statusCls: NgClassInterface = {};
  hasFeedback: boolean = false;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};

  @Output() readonly blur = new EventEmitter();
  @Output() readonly focus = new EventEmitter();
  /** The native `<span class="ant-input-number-handler-up"></span>` element. */
  @ViewChild('upHandler', { static: true }) upHandler!: ElementRef<HTMLElement>;
  /** The native `<span class="ant-input-number-handler-down"></span>` element. */
  @ViewChild('downHandler', { static: true }) downHandler!: ElementRef<HTMLElement>;
  /** The native `<input class="ant-input-number-input" />` element. */
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef<HTMLInputElement>;
  @Input() size: TriSizeLDSType = 'default';
  @Input({ transform: numberAttribute }) min: number = -Infinity;
  @Input({ transform: numberAttribute }) max: number = Infinity;
  @Input() parser = (value: string): string =>
    value
      .trim()
      .replace(/。/g, '.')
      .replace(/[^\w.-]+/g, '');
  @Input() precision?: number;
  @Input() precisionMode: 'cut' | 'toFixed' | ((value: number | string, precision?: number) => number) = 'toFixed';
  @Input() placeHolder = '';
  @Input() status: TriStatus = '';
  @Input({ transform: numberAttribute }) step = 1;
  @Input() inputMode: string = 'decimal';
  @Input() id: string | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) readOnly = false;
  @Input({ transform: booleanAttribute }) autoFocus = false;
  @Input({ transform: booleanAttribute }) borderless: boolean = false;
  @Input() formatter: (value: number) => string | number = value => value;

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(NZ_SPACE_COMPACT_SIZE, { optional: true });
  private autoStepTimer?: ReturnType<typeof setTimeout>;
  private parsedValue?: string | number;
  private value?: number;
  private isNzDisableFirstChange: boolean = true;

  onModelChange(value: string): void {
    this.parsedValue = this.parser(value);
    this.inputElement.nativeElement.value = `${this.parsedValue}`;
    const validValue = this.getCurrentValidValue(this.parsedValue);
    this.setValue(validValue);
  }

  getCurrentValidValue(value: string | number): number {
    let val = value;
    if (val === '') {
      val = '';
    } else if (!this.isNotCompleteNumber(val)) {
      val = `${this.getValidValue(val)}`;
    } else {
      val = this.value!;
    }
    return this.toNumber(val);
  }

  // '1.' '1x' 'xx' '' => are not complete numbers
  isNotCompleteNumber(num: string | number): boolean {
    return (
      isNaN(num as number) ||
      num === '' ||
      num === null ||
      !!(num && num.toString().indexOf('.') === num.toString().length - 1)
    );
  }

  getValidValue(value?: string | number): string | number | undefined {
    let val = parseFloat(value as string);
    // https://github.com/ant-design/ant-design/issues/7358
    if (isNaN(val)) {
      return value;
    }
    if (val < this.min) {
      val = this.min;
    }
    if (val > this.max) {
      val = this.max;
    }
    return val;
  }

  toNumber(num: string | number): number {
    if (this.isNotCompleteNumber(num)) {
      return num as number;
    }
    const numStr = String(num);
    if (numStr.indexOf('.') >= 0 && isNotNil(this.precision)) {
      if (typeof this.precisionMode === 'function') {
        return this.precisionMode(num, this.precision);
      } else if (this.precisionMode === 'cut') {
        const numSplit = numStr.split('.');
        numSplit[1] = numSplit[1].slice(0, this.precision);
        return Number(numSplit.join('.'));
      }
      return Number(Number(num).toFixed(this.precision));
    }
    return Number(num);
  }

  getRatio(e: KeyboardEvent): number {
    let ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  }

  down(e: MouseEvent | KeyboardEvent, ratio?: number): void {
    if (!this.isFocused) {
      this._focus();
    }
    this._step('down', e, ratio);
  }

  up(e: MouseEvent | KeyboardEvent, ratio?: number): void {
    if (!this.isFocused) {
      this._focus();
    }
    this._step('up', e, ratio);
  }

  getPrecision(value: number): number {
    const valueString = value.toString();
    if (valueString.indexOf('e-') >= 0) {
      return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
    }
    let precision = 0;
    if (valueString.indexOf('.') >= 0) {
      precision = valueString.length - valueString.indexOf('.') - 1;
    }
    return precision;
  }

  // step={1.0} value={1.51}
  // press +
  // then value should be 2.51, rather than 2.5
  // if this.props.precision is undefined
  // https://github.com/react-component/input-number/issues/39
  getMaxPrecision(currentValue: string | number, ratio: number): number {
    if (isNotNil(this.precision)) {
      return this.precision;
    }
    const ratioPrecision = this.getPrecision(ratio);
    const stepPrecision = this.getPrecision(this.step);
    const currentValuePrecision = this.getPrecision(currentValue as number);
    if (!currentValue) {
      return ratioPrecision + stepPrecision;
    }
    return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
  }

  getPrecisionFactor(currentValue: string | number, ratio: number): number {
    const precision = this.getMaxPrecision(currentValue, ratio);
    return Math.pow(10, precision);
  }

  upStep(val: string | number, rat: number): number {
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    let result;
    if (typeof val === 'number') {
      result = ((precisionFactor * val + precisionFactor * this.step * rat) / precisionFactor).toFixed(precision);
    } else {
      result = this.min === -Infinity ? this.step : this.min;
    }
    return this.toNumber(result);
  }

  downStep(val: string | number, rat: number): number {
    const precisionFactor = this.getPrecisionFactor(val, rat);
    const precision = Math.abs(this.getMaxPrecision(val, rat));
    let result;
    if (typeof val === 'number') {
      result = ((precisionFactor * val - precisionFactor * this.step * rat) / precisionFactor).toFixed(precision);
    } else {
      result = this.min === -Infinity ? -this.step : this.min;
    }
    return this.toNumber(result);
  }

  _step<T extends keyof TriInputNumberLegacyComponent>(type: T, e: MouseEvent | KeyboardEvent, ratio: number = 1): void {
    this.stop();
    e.preventDefault();
    if (this.disabled) {
      return;
    }
    const value = this.getCurrentValidValue(this.parsedValue!) || 0;
    let val = 0;
    if (type === 'up') {
      val = this.upStep(value, ratio);
    } else if (type === 'down') {
      val = this.downStep(value, ratio);
    }
    const outOfRange = val > this.max || val < this.min;
    if (val > this.max) {
      val = this.max;
    } else if (val < this.min) {
      val = this.min;
    }
    this.setValue(val);
    this.updateDisplayValue(val);
    this.isFocused = true;
    if (outOfRange) {
      return;
    }
    this.autoStepTimer = setTimeout(() => {
      (this[type] as (e: MouseEvent | KeyboardEvent, ratio: number) => void)(e, ratio);
    }, 300);
  }

  stop(): void {
    if (this.autoStepTimer) {
      clearTimeout(this.autoStepTimer);
    }
  }

  setValue(value: number): void {
    if (`${this.value}` !== `${value}`) {
      this.onChange(value);
    }
    this.value = value;
    this.parsedValue = value;
    this.disabledUp = this.disabledDown = false;
    if (value || value === 0) {
      const val = Number(value);
      if (val >= this.max) {
        this.disabledUp = true;
      }
      if (val <= this.min) {
        this.disabledDown = true;
      }
    }
  }

  updateDisplayValue(value: number): void {
    const displayValue = isNotNil(this.formatter(value)) ? this.formatter(value) : '';
    this.displayValue = displayValue;
    this.inputElement.nativeElement.value = `${displayValue}`;
  }

  writeValue(value: number): void {
    this.value = value;
    this.setValue(value);
    this.updateDisplayValue(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || disabled;
    this.isNzDisableFirstChange = false;
    this.disabled$.next(this.disabled);
    this.cdr.markForCheck();
  }

  _focus(): void {
    this.focusMonitor.focusVia(this.inputElement, 'keyboard');
  }

  _blur(): void {
    this.inputElement.nativeElement.blur();
  }

  formStatusService = inject(TriFormStatusService, { optional: true });
  formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  constructor(
    private ngZone: NgZone,
    private elementRef: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private focusMonitor: FocusMonitor,
    private renderer: Renderer2,
    private directionality: Directionality,
    private destroy$: TriDestroyService
  ) {}

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          this.isFocused = false;
          this.updateDisplayValue(this.value!);
          this.blur.emit();
          Promise.resolve().then(() => this.onTouched());
        } else {
          this.isFocused = true;
          this.focus.emit();
        }
      });

    this.dir = this.directionality.value;
    this.directionality.change.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });

    this.setupHandlersListeners();

    fromEventOutsideAngular(this.inputElement.nativeElement, 'keyup')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.stop());

    fromEventOutsideAngular<KeyboardEvent>(this.inputElement.nativeElement, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        const { keyCode } = event;

        if (keyCode !== UP_ARROW && keyCode !== DOWN_ARROW && keyCode !== ENTER) {
          return;
        }

        this.ngZone.run(() => {
          if (keyCode === UP_ARROW) {
            const ratio = this.getRatio(event);
            this.up(event, ratio);
            this.stop();
          } else if (keyCode === DOWN_ARROW) {
            const ratio = this.getRatio(event);
            this.down(event, ratio);
            this.stop();
          } else {
            this.updateDisplayValue(this.value!);
          }
          this.cdr.markForCheck();
        });
      });
  }

  ngOnChanges({ nzStatus, nzDisabled, nzFormatter, nzSize }: SimpleChanges): void {
    if (nzFormatter && !nzFormatter.isFirstChange()) {
      const validValue = this.getCurrentValidValue(this.parsedValue!);
      this.setValue(validValue);
      this.updateDisplayValue(validValue);
    }
    if (nzDisabled) {
      this.disabled$.next(this.disabled);
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this._focus();
    }
  }

  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  private setupHandlersListeners(): void {
    merge(
      fromEventOutsideAngular(this.upHandler.nativeElement, 'mouseup'),
      fromEventOutsideAngular(this.upHandler.nativeElement, 'mouseleave'),
      fromEventOutsideAngular(this.downHandler.nativeElement, 'mouseup'),
      fromEventOutsideAngular(this.downHandler.nativeElement, 'mouseleave')
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.stop());
  }

  private setStatusStyles(status: TriValidateStatus, hasFeedback: boolean): void {
    // set inner status
    this._status = status;
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
    // render status if nzStatus is set
    this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
    Object.keys(this.statusCls).forEach(status => {
      if (this.statusCls[status]) {
        this.renderer.addClass(this.elementRef.nativeElement, status);
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, status);
      }
    });
  }
}
