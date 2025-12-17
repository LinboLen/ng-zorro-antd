/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, UP_ARROW } from '@angular/cdk/keycodes';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  numberAttribute,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriFormItemFeedbackIconComponent, TriFormStatusService } from 'ng-zorro-antd/core/form';
import {
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  TriVariant,
  OnChangeType,
  OnTouchedType
} from 'ng-zorro-antd/core/types';
import {
  getStatusClassNames,
  getVariantClassNames,
  InputFocusOptions,
  isNil,
  isNotNil,
  triggerFocus
} from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';
import {
  TriInputAddonAfterDirective,
  TriInputAddonBeforeDirective,
  TriInputPrefixDirective,
  TriInputSuffixDirective
} from 'ng-zorro-antd/input';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-input-number',
  exportAs: 'triInputNumber',
  imports: [TriIconModule, TriFormItemFeedbackIconComponent, NgTemplateOutlet],
  template: `
    @if (hasAddon()) {
      <ng-template [ngTemplateOutlet]="inputNumberWithAddonInner" />
    } @else if (hasAffix()) {
      <ng-template [ngTemplateOutlet]="inputNumberWithAffixInner" />
    } @else {
      <ng-template [ngTemplateOutlet]="inputNumberInner" />
    }

    <ng-template #inputNumberWithAddonInner>
      <div class="tri-input-number-wrapper tri-input-number-group">
        @if (hasAddonBefore()) {
          <div class="tri-input-number-group-addon">
            <ng-content select="[nzInputAddonBefore]">{{ addonBefore() }}</ng-content>
          </div>
        }

        @if (hasAffix()) {
          <ng-template [ngTemplateOutlet]="inputNumberWithAffix" />
        } @else {
          <ng-template [ngTemplateOutlet]="inputNumber" />
        }

        @if (hasAddonAfter()) {
          <div class="tri-input-number-group-addon">
            <ng-content select="[nzInputAddonAfter]">{{ addonAfter() }}</ng-content>
          </div>
        }
      </div>
    </ng-template>

    <ng-template #inputNumberWithAffix>
      <div [class]="affixWrapperClass()">
        <ng-template [ngTemplateOutlet]="inputNumberWithAffixInner" />
      </div>
    </ng-template>

    <ng-template #inputNumberWithAffixInner>
      @if (hasPrefix()) {
        <span class="tri-input-number-prefix">
          <ng-content select="[nzInputPrefix]">{{ prefix() }}</ng-content>
        </span>
      }
      <ng-template [ngTemplateOutlet]="inputNumber" />
      @if (hasSuffix()) {
        <span class="tri-input-number-suffix">
          <ng-content select="[nzInputSuffix]">{{ suffix() }}</ng-content>
          @if (hasFeedback() && finalStatus()) {
            <tri-form-item-feedback-icon [status]="finalStatus()" />
          }
        </span>
      }
    </ng-template>

    <ng-template #inputNumber>
      <div #inputNumberHost [class]="inputNumberClass()">
        <ng-template [ngTemplateOutlet]="inputNumberInner" />
      </div>
    </ng-template>

    <ng-template #inputNumberInner>
      @if (controls()) {
        <div #handlers class="tri-input-number-handler-wrap" (mouseup)="stopAutoStep()" (mouseleave)="stopAutoStep()">
          <span
            role="button"
            unselectable="on"
            class="tri-input-number-handler tri-input-number-handler-up"
            [class.tri-input-number-handler-up-disabled]="upDisabled()"
            [attr.aria-disabled]="upDisabled()"
            (mousedown)="onStepMouseDown($event, true)"
          >
            <ng-content select="[nzInputNumberUpIcon]">
              <tri-icon type="up" class="tri-input-number-handler-up-inner" />
            </ng-content>
          </span>
          <span
            role="button"
            unselectable="on"
            class="tri-input-number-handler tri-input-number-handler-down"
            [class.tri-input-number-handler-down-disabled]="downDisabled()"
            [attr.aria-disabled]="downDisabled()"
            (mousedown)="onStepMouseDown($event, false)"
          >
            <ng-content select="[nzInputNumberDownIcon]">
              <tri-icon type="down" class="tri-input-number-handler-down-inner" />
            </ng-content>
          </span>
        </div>
      }

      <div class="tri-input-number-input-wrap">
        <input
          #input
          autocomplete="off"
          role="spinbutton"
          class="tri-input-number-input"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.id]="id()"
          [attr.step]="step()"
          [attr.value]="displayValue()"
          [value]="displayValue()"
          [placeholder]="placeHolder() ?? ''"
          [disabled]="finalDisabled()"
          [readOnly]="readOnly()"
          (input)="onInput(input.value)"
          (wheel)="onWheel($event)"
        />
      </div>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriInputNumberComponent),
      multi: true
    },
    { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'input-number' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'class()',
    '(keydown)': 'onKeyDown($event)'
  },
  hostDirectives: [TriSpaceCompactItemDirective]
})
export class TriInputNumberComponent implements OnInit, ControlValueAccessor {
  readonly id = input<string | null>(null);
  readonly size = input<TriSizeLDSType>('default');
  readonly placeHolder = input<string | null>(null);
  readonly status = input<TriStatus>('');
  readonly variant = input<TriVariant>('outlined');
  readonly step = input(1, { transform: numberAttribute });
  readonly min = input(Number.MIN_SAFE_INTEGER, { transform: numberAttribute });
  readonly max = input(Number.MAX_SAFE_INTEGER, { transform: numberAttribute });
  readonly precision = input<number | null>(null);
  readonly parser = input<((value: string) => number) | null>();
  readonly formatter = input<((value: number) => string) | null>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readOnly = input(false, { transform: booleanAttribute });
  readonly autoFocus = input(false, { transform: booleanAttribute });
  readonly keyboard = input(true, { transform: booleanAttribute });
  readonly controls = input(true, { transform: booleanAttribute });
  readonly changeOnWheel = input(true, { transform: booleanAttribute });
  readonly prefix = input<string>();
  readonly suffix = input<string>();
  readonly addonBefore = input<string>();
  readonly addonAfter = input<string>();

  readonly blur = output<void>();
  readonly focus = output<void>();

  readonly onStep = output<{ value: number; offset: number; type: 'up' | 'down' }>();

  private onChange: OnChangeType = () => {};
  private onTouched: OnTouchedType = () => {};
  private isDisabledFirstChange = true;
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private inputRef = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private hostRef = viewChild<ElementRef<HTMLDivElement>>('inputNumberHost');
  private elementRef = inject(ElementRef);
  private injector = inject(Injector);
  private focusMonitor = inject(FocusMonitor);
  private directionality = inject(Directionality);
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private autoStepTimer: ReturnType<typeof setTimeout> | null = null;
  private defaultFormatter = (value: number): string => {
    const precision = this.precision();
    if (isNotNil(precision)) {
      return value.toFixed(precision);
    }
    return value.toString();
  };

  protected readonly value = signal<number | null>(null);
  protected readonly displayValue = signal('');

  protected readonly dir = toSignal(this.directionality.change, { initialValue: this.directionality.value });
  protected readonly focused = signal(false);
  protected readonly hasFeedback = signal(false);
  protected readonly finalStatus = linkedSignal<TriValidateStatus>(() => this.status());
  protected readonly finalDisabled = linkedSignal(() => this.disabled());

  protected readonly _prefix = contentChild(TriInputPrefixDirective);
  protected readonly _suffix = contentChild(TriInputSuffixDirective);
  protected readonly _addonBefore = contentChild(TriInputAddonBeforeDirective);
  protected readonly _addonAfter = contentChild(TriInputAddonAfterDirective);

  protected readonly hasPrefix = computed(() => !!this.prefix() || !!this._prefix());
  protected readonly hasSuffix = computed(() => !!this.suffix() || !!this._suffix() || this.hasFeedback());
  protected readonly hasAffix = computed(() => this.hasPrefix() || this.hasSuffix());
  protected readonly hasAddonBefore = computed(() => !!this.addonBefore() || !!this._addonBefore());
  protected readonly hasAddonAfter = computed(() => !!this.addonAfter() || !!this._addonAfter());
  protected readonly hasAddon = computed(() => this.hasAddonBefore() || this.hasAddonAfter());

  protected readonly class = computed(() => {
    if (this.hasAddon()) {
      return this.groupWrapperClass();
    }
    if (this.hasAffix()) {
      return this.affixWrapperClass();
    }
    return this.inputNumberClass();
  });
  protected readonly inputNumberClass = computed(() => {
    return {
      'ant-input-number': true,
      'ant-input-number-lg': this.finalSize() === 'large',
      'ant-input-number-sm': this.finalSize() === 'small',
      'ant-input-number-disabled': this.finalDisabled(),
      'ant-input-number-readonly': this.readOnly(),
      'ant-input-number-focused': this.focused(),
      'ant-input-number-rtl': this.dir() === 'rtl',
      'ant-input-number-in-form-item': !!this.formStatusService,
      'ant-input-number-out-of-range': this.value() !== null && !isInRange(this.value()!, this.min(), this.max()),
      ...getVariantClassNames('ant-input-number', this.variant()),
      ...getStatusClassNames('ant-input-number', this.finalStatus(), this.hasFeedback())
    };
  });
  protected readonly affixWrapperClass = computed(() => {
    return {
      'ant-input-number-affix-wrapper': true,
      'ant-input-number-affix-wrapper-disabled': this.finalDisabled(),
      'ant-input-number-affix-wrapper-readonly': this.readOnly(),
      'ant-input-number-affix-wrapper-focused': this.focused(),
      'ant-input-number-affix-wrapper-rtl': this.dir() === 'rtl',
      ...getStatusClassNames('ant-input-number-affix-wrapper', this.finalStatus(), this.hasFeedback()),
      ...getVariantClassNames('ant-input-number-affix-wrapper', this.variant())
    };
  });
  protected readonly groupWrapperClass = computed(() => {
    return {
      'ant-input-number-group-wrapper': true,
      'ant-input-number-group-wrapper-rtl': this.dir() === 'rtl',
      ...getStatusClassNames('ant-input-number-group-wrapper', this.finalStatus(), this.hasFeedback()),
      ...getVariantClassNames('ant-input-number-group-wrapper', this.variant())
    };
  });

  protected readonly finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.size();
  });

  protected readonly upDisabled = computed(() => {
    return !isNil(this.value()) && this.value()! >= this.max();
  });
  protected readonly downDisabled = computed(() => {
    return !isNil(this.value()) && this.value()! <= this.min();
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const hostRef = this.hostRef();
      const element = hostRef ? hostRef : this.elementRef;

      this.focusMonitor
        .monitor(element, true)
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(origin => {
          this.focused.set(!!origin);

          if (origin) {
            this.focus.emit();
          } else {
            this.fixValue();
            this.onTouched();
            this.blur.emit();
          }
        });

      destroyRef.onDestroy(() => {
        this.focusMonitor.stopMonitoring(element);
      });
    });

    this.formStatusService?.formStatusChanges.pipe(takeUntilDestroyed()).subscribe(({ status, hasFeedback }) => {
      this.finalStatus.set(status);
      this.hasFeedback.set(hasFeedback);
    });
  }

  ngOnInit(): void {
    if (this.autoFocus()) {
      afterNextRender(() => this._focus(), { injector: this.injector });
    }
  }

  writeValue(value: number | null | undefined): void {
    if (isNil(value)) value = null;
    untracked(() => {
      this.value.set(value);
      this.setValue(value);
    });
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    untracked(() => {
      this.finalDisabled.set((this.isDisabledFirstChange && this.disabled()) || disabled);
    });
    this.isDisabledFirstChange = false;
  }

  _focus(options?: InputFocusOptions): void {
    triggerFocus(this.inputRef().nativeElement, options);
  }

  _blur(): void {
    this.inputRef().nativeElement.blur();
  }

  #step(event: MouseEvent | KeyboardEvent, up: boolean): void {
    // Ignore step since out of range
    if ((up && this.upDisabled()) || (!up && this.downDisabled())) {
      return;
    }

    // When hold the shift key, the step is 10 times
    let step = event.shiftKey ? this.step() * 10 : this.step();
    if (!up) {
      step = -step;
    }

    const places = getDecimalPlaces(step);
    const multiple = 10 ** places;
    const nextValue = getRangeValue(
      // Convert floating point numbers to integers to avoid floating point math errors
      (Math.round((this.value() || 0) * multiple) + Math.round(step * multiple)) / multiple,
      this.min(),
      this.max(),
      this.precision()
    );
    this.setValue(nextValue);

    this.onStep.emit({
      type: up ? 'up' : 'down',
      value: this.value()!,
      offset: this.step()
    });

    this._focus();
  }

  private setValue(value: number | null): void {
    const formatter = this.formatter() ?? this.defaultFormatter;
    const precision = this.precision();

    if (isNotNil(precision)) {
      value &&= +value.toFixed(precision);
    }

    const formattedValue = isNil(value) ? '' : formatter(value);
    this.displayValue.set(formattedValue);
    this.updateValue(value);
  }

  private setValueByTyping(value: string): void {
    this.displayValue.set(value);

    if (value === '') {
      this.updateValue(null);
      return;
    }

    const parser = this.parser() ?? defaultParser;
    const parsedValue = parser(value);

    if (isNotCompleteNumber(value) || Number.isNaN(parsedValue)) {
      return;
    }

    // Formatting is called during input only if the user provided a formatter.
    // Otherwise, formatting is only called when the input blurs.
    const formatter = this.formatter();
    if (formatter) {
      const formattedValue = formatter(parsedValue);
      this.displayValue.set(formattedValue);
    }

    if (!isInRange(parsedValue, this.min(), this.max())) {
      return;
    }

    this.updateValue(parsedValue);
  }

  private updateValue(value: number | null): void {
    if (this.value() !== value) {
      this.value.set(value);
      this.onChange(value);
    }
  }

  private fixValue(): void {
    const displayValue = this.displayValue();

    if (displayValue === '') {
      return;
    }

    const parser = this.parser() ?? defaultParser;
    let fixedValue: number | null = parser(displayValue);

    // If parsing fails, revert to the previous value
    if (Number.isNaN(fixedValue)) {
      fixedValue = this.value();
    } else {
      const precision = this.precision();
      // fix precision
      if (isNotNil(precision) && getDecimalPlaces(fixedValue) !== precision) {
        fixedValue = +fixedValue.toFixed(precision);
      }

      // fix range
      if (!isInRange(fixedValue, this.min(), this.max())) {
        fixedValue = getRangeValue(fixedValue, this.min(), this.max(), precision);
      }
    }

    this.setValue(fixedValue);
  }

  protected stopAutoStep(): void {
    if (this.autoStepTimer !== null) {
      clearTimeout(this.autoStepTimer);
      this.autoStepTimer = null;
    }
  }

  protected onStepMouseDown(event: MouseEvent | KeyboardEvent, up: boolean): void {
    event.preventDefault();
    this.stopAutoStep();

    this.#step(event, up);

    // Loop step for interval
    const loopStep: () => void = () => {
      this.#step(event, up);
      this.autoStepTimer = setTimeout(loopStep, STEP_INTERVAL);
    };

    // First time press will wait some time to trigger loop step update
    this.autoStepTimer = setTimeout(loopStep, STEP_DELAY);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    switch (event.keyCode) {
      case UP_ARROW:
        event.preventDefault();
        this.keyboard() && this.#step(event, true);
        break;
      case DOWN_ARROW:
        event.preventDefault();
        this.keyboard() && this.#step(event, false);
        break;
      case ENTER:
        this.fixValue();
        break;
    }
  }

  protected onInput(value: string): void {
    this.setValueByTyping(value);
  }

  protected onWheel(event: WheelEvent): void {
    if (this.disabled() || !this.changeOnWheel()) {
      return;
    }

    event.preventDefault();
    this.#step(event, event.deltaY < 0);
  }
}

/**
 * When click and hold on a button - the speed of auto changing the value.
 */
const STEP_INTERVAL = 200;

/**
 * When click and hold on a button - the delay before auto changing the value.
 */
const STEP_DELAY = 600;

function defaultParser(value: string): number {
  const parsedValue = value.trim().replace(/,/g, '').replace(/。/g, '.');
  // `+'' === 0`, so we need to check if parsedValue is empty
  if (parsedValue.length) {
    return +parsedValue;
  }
  return NaN;
}

function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * if max > 0, round down with precision. Example: input= 3.5, max= 3.5, precision=0; output= 3
 * if max < 0, round up   with precision. Example: input=-3.5, max=-3.5, precision=0; output=-4
 * if min > 0, round up   with precision. Example: input= 3.5, min= 3.5, precision=0; output= 4
 * if min < 0, round down with precision. Example: input=-3.5, min=-3.5, precision=0; output=-3
 */
function getRangeValue(value: number, min: number, max: number, precision: number | null = null): number {
  if (precision === null) {
    if (value < min) {
      return min;
    }

    if (value > max) {
      return max;
    }

    return value;
  }

  const fixedValue = +value.toFixed(precision);
  const multiple = Math.pow(10, precision);

  if (fixedValue < min) {
    return Math.ceil(min * multiple) / multiple;
  }

  if (fixedValue > max) {
    return Math.floor(max * multiple) / multiple;
  }

  return fixedValue;
}

function getDecimalPlaces(num: number): number {
  return num.toString().split('.')[1]?.length || 0;
}

function isNotCompleteNumber(value: string | number): boolean {
  return /[.。](\d*0)?$/.test(value.toString());
}
