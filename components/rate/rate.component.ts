/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  numberAttribute,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { NgClassType, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

import { TriRateItemComponent } from './rate-item.component';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'rate';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triRate',
  template: `
    <ul
      #ulElement
      class="tri-rate"
      [class.tri-rate-disabled]="disabled"
      [class.tri-rate-rtl]="dir === 'rtl'"
      [class]="classMap"
      (keydown)="onKeyDown($event); $event.preventDefault()"
      (mouseleave)="onRateLeave(); $event.stopPropagation()"
      [tabindex]="disabled ? -1 : 1"
    >
      @for (star of starArray; track star) {
        <li
          class="tri-rate-star"
          [class]="starStyleArray[$index] || ''"
          tri-tooltip
          [tooltipTitle]="tooltips[$index]"
        >
          <div
            tri-rate-item
            [allowHalf]="allowHalf"
            [character]="character"
            [index]="$index"
            (itemHover)="onItemHover($index, $event)"
            (itemClick)="onItemClick($index, $event)"
          ></div>
        </li>
      }
    </ul>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriRateComponent),
      multi: true
    }
  ],
  imports: [TriToolTipModule, TriRateItemComponent]
})
export class TriRateComponent implements OnInit, ControlValueAccessor, OnChanges {
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  private readonly ngZone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('ulElement', { static: true }) ulElement!: ElementRef<HTMLUListElement>;

  @Input({ transform: booleanAttribute }) @WithConfig() allowClear: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() allowHalf: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) autoFocus: boolean = false;
  @Input() character!: TemplateRef<{ $implicit: number }>;
  @Input({ transform: numberAttribute }) count: number = 5;
  @Input() tooltips: string[] = [];
  @Output() readonly onBlur = new EventEmitter<FocusEvent>();
  @Output() readonly onFocus = new EventEmitter<FocusEvent>();
  @Output() readonly onHoverChange = new EventEmitter<number>();
  @Output() readonly onKeyDown = new EventEmitter<KeyboardEvent>();

  classMap: NgClassType = {};
  starArray: number[] = [];
  starStyleArray: NgClassType[] = [];
  dir: Direction = 'ltr';

  private hasHalf = false;
  private hoverValue = 0;
  private isFocused = false;
  private _value = 0;
  private isNzDisableFirstChange: boolean = true;

  get value(): number {
    return this._value;
  }

  set value(input: number) {
    if (this._value === input) {
      return;
    }

    this._value = input;
    this.hasHalf = !Number.isInteger(input) && this.allowHalf;
    this.hoverValue = Math.ceil(input);
  }

  constructor() {
    onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzAutoFocus, nzCount, nzValue } = changes;

    if (nzAutoFocus && !nzAutoFocus.isFirstChange()) {
      const el = this.ulElement.nativeElement;
      if (this.autoFocus && !this.disabled) {
        this.renderer.setAttribute(el, 'autofocus', 'autofocus');
      } else {
        this.renderer.removeAttribute(el, 'autofocus');
      }
    }

    if (nzCount) {
      this.updateStarArray();
    }

    if (nzValue) {
      this.updateStarStyle();
    }
  }

  ngOnInit(): void {
    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

    fromEventOutsideAngular<FocusEvent>(this.ulElement.nativeElement, 'focus')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.isFocused = true;
        if (this.onFocus.observers.length) {
          this.ngZone.run(() => this.onFocus.emit(event));
        }
      });

    fromEventOutsideAngular<FocusEvent>(this.ulElement.nativeElement, 'blur')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.isFocused = false;
        if (this.onBlur.observers.length) {
          this.ngZone.run(() => this.onBlur.emit(event));
        }
      });
  }

  onItemClick(index: number, isHalf: boolean): void {
    if (this.disabled) {
      return;
    }

    this.hoverValue = index + 1;

    const actualValue = isHalf ? index + 0.5 : index + 1;

    if (this.value === actualValue) {
      if (this.allowClear) {
        this.value = 0;
        this.onChange(this.value);
      }
    } else {
      this.value = actualValue;
      this.onChange(this.value);
    }

    this.updateStarStyle();
  }

  onItemHover(index: number, isHalf: boolean): void {
    if (this.disabled) {
      return;
    }
    if (this.hoverValue !== index + 1 || isHalf !== this.hasHalf) {
      this.hoverValue = index + 1;
      this.hasHalf = isHalf;
      this.updateStarStyle();
    }
    this.onHoverChange.emit(this.hoverValue);
  }

  onRateLeave(): void {
    this.hasHalf = !Number.isInteger(this.value);
    this.hoverValue = Math.ceil(this.value);
    this.onHoverChange.emit(this.hoverValue);
    this.updateStarStyle();
  }

  focus(): void {
    this.ulElement.nativeElement.focus();
  }

  blur(): void {
    this.ulElement.nativeElement.blur();
  }

  _onKeyDown(e: KeyboardEvent): void {
    const oldVal = this.value;

    if (e.keyCode === RIGHT_ARROW && this.value < this.count) {
      this.value += this.allowHalf ? 0.5 : 1;
    } else if (e.keyCode === LEFT_ARROW && this.value > 0) {
      this.value -= this.allowHalf ? 0.5 : 1;
    }

    if (oldVal !== this.value) {
      this.onChange(this.value);
      this.onKeyDown.emit(e);
      this.updateStarStyle();
      this.cdr.markForCheck();
    }
  }

  private updateStarArray(): void {
    this.starArray = Array(this.count)
      .fill(0)
      .map((_, i) => i);

    this.updateStarStyle();
  }

  private updateStarStyle(): void {
    this.starStyleArray = this.starArray.map(i => {
      const prefix = 'ant-rate-star';
      const value = i + 1;
      return {
        [`${prefix}-full`]: value < this.hoverValue || (!this.hasHalf && value === this.hoverValue),
        [`${prefix}-half`]: this.hasHalf && value === this.hoverValue,
        [`${prefix}-active`]: this.hasHalf && value === this.hoverValue,
        [`${prefix}-zero`]: value > this.hoverValue,
        [`${prefix}-focused`]: this.hasHalf && value === this.hoverValue && this.isFocused
      };
    });
  }

  writeValue(value: number | null): void {
    this.value = value || 0;
    this.updateStarArray();
    this.cdr.markForCheck();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  onChange: (value: number) => void = () => null;
  onTouched: () => void = () => null;
}
