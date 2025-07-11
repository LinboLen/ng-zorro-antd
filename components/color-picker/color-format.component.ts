/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { TriInputDirective, TriInputGroupComponent } from 'ng-zorro-antd/input';
import { TriInputNumberComponent } from 'ng-zorro-antd/input-number';
import { TriSelectModule } from 'ng-zorro-antd/select';

import { generateColor } from './src/util/util';
import { TriColorPickerFormatType, ValidFormKey } from './typings';

@Component({
  selector: 'tri-color-format',
  exportAs: 'triColorFormat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TriSelectModule, TriInputDirective, TriInputGroupComponent, TriInputNumberComponent],
  template: `
    <div [formGroup]="validateForm" class="tri-color-picker-input-container">
      <div class="tri-color-picker-format-select">
        <tri-select formControlName="isFormat" borderless size="small">
          <tri-option value="hex" label="HEX" />
          <tri-option value="hsb" label="HSB" />
          <tri-option value="rgb" label="RGB" />
        </tri-select>
      </div>

      <div class="tri-color-picker-input">
        @switch (validateForm.controls.isFormat.value) {
          @case ('hex') {
            <div class="tri-color-picker-hex-input">
              <tri-input-group prefix="#" size="small">
                <input tri-input size="small" formControlName="hex" />
              </tri-input-group>
            </div>
          }
          @case ('hsb') {
            <div class="tri-color-picker-hsb-input">
              <div class="tri-color-picker-steppers tri-color-picker-hsb-input">
                <tri-input-number
                  formControlName="hsbH"
                  [min]="0"
                  [max]="360"
                  [step]="1"
                  [precision]="0"
                  size="small"
                />
              </div>
              <div class="tri-color-picker-steppers tri-color-picker-hsb-input">
                <tri-input-number
                  formControlName="hsbS"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [formatter]="formatterPercent"
                  [parser]="parserPercent"
                  size="small"
                />
              </div>
              <div class="tri-color-picker-steppers tri-color-picker-hsb-input">
                <tri-input-number
                  formControlName="hsbB"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [formatter]="formatterPercent"
                  [parser]="parserPercent"
                  size="small"
                />
              </div>
            </div>
          }
          @default {
            <div class="tri-color-picker-rgb-input">
              <div class="tri-color-picker-steppers tri-color-picker-rgb-input">
                <tri-input-number formControlName="rgbR" [min]="0" [max]="255" [step]="1" size="small" />
              </div>
              <div class="tri-color-picker-steppers tri-color-picker-rgb-input">
                <tri-input-number formControlName="rgbG" [min]="0" [max]="255" [step]="1" size="small" />
              </div>
              <div class="tri-color-picker-steppers tri-color-picker-rgb-input">
                <tri-input-number formControlName="rgbB" [min]="0" [max]="255" [step]="1" size="small" />
              </div>
            </div>
          }
        }
      </div>

      @if (!disabledAlpha) {
        <div class="tri-color-picker-steppers tri-color-picker-alpha-input">
          <tri-input-number
            formControlName="roundA"
            [min]="0"
            [max]="100"
            [step]="1"
            [formatter]="formatterPercent"
            [parser]="parserPercent"
            size="small"
          />
        </div>
      }
    </div>
  `
})
export class TriColorFormatComponent implements OnChanges, OnInit {
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);
  @Input() format: TriColorPickerFormatType | null = null;
  @Input() colorValue: string = '';
  @Input({ transform: booleanAttribute }) clearColor: boolean = false;
  @Input({ transform: booleanAttribute }) disabledAlpha: boolean = false;
  @Output() readonly formatChange = new EventEmitter<{ color: string; format: TriColorPickerFormatType }>();
  @Output() readonly onFormatChange = new EventEmitter<TriColorPickerFormatType>();

  validatorFn(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const REGEXP = /^[0-9a-fA-F]{6}$/;
      if (!control.value) {
        return { error: true };
      } else if (!REGEXP.test(control.value)) {
        return { error: true };
      }
      return null;
    };
  }

  validateForm: FormGroup<{
    isFormat: FormControl<TriColorPickerFormatType | null>;
    hex: FormControl<string | null>;
    hsbH: FormControl<number>;
    hsbS: FormControl<number>;
    hsbB: FormControl<number>;
    rgbR: FormControl<number>;
    rgbG: FormControl<number>;
    rgbB: FormControl<number>;
    roundA: FormControl<number>;
  }> = this.formBuilder.nonNullable.group({
    isFormat: this.formBuilder.control<TriColorPickerFormatType>('hex'),
    hex: this.formBuilder.control<string>('1677FF', this.validatorFn()),
    hsbH: 215,
    hsbS: 91,
    hsbB: 100,
    rgbR: 22,
    rgbG: 119,
    rgbB: 255,
    roundA: 100
  });

  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): number => +value.replace(' %', '');

  ngOnInit(): void {
    this.validateForm.valueChanges
      .pipe(
        filter(() => this.validateForm.valid),
        debounceTime(200),
        distinctUntilChanged((prev, current) =>
          Object.keys(prev).every(key => prev[key as ValidFormKey] === current[key as ValidFormKey])
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        let color = '';
        switch (value.isFormat) {
          case 'hsb':
            color = generateColor({
              h: Number(value.hsbH),
              s: Number(value.hsbS) / 100,
              b: Number(value.hsbB) / 100,
              a: Number(value.roundA) / 100
            }).toHsbString();
            break;
          case 'rgb':
            color = generateColor({
              r: Number(value.rgbR),
              g: Number(value.rgbG),
              b: Number(value.rgbB),
              a: Number(value.roundA) / 100
            }).toRgbString();
            break;
          default: {
            const hex = generateColor(value.hex as TriColorPickerFormatType);
            const hexColor = generateColor({
              r: hex.r,
              g: hex.g,
              b: hex.b,
              a: Number(value.roundA) / 100
            });
            color = hexColor.getAlpha() < 1 ? hexColor.toHex8String() : hexColor.toHexString();
            break;
          }
        }
        this.formatChange.emit({ color, format: value.isFormat || this.format || 'hex' });
      });

    this.validateForm
      .get('isFormat')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.onFormatChange.emit(value as TriColorPickerFormatType);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { colorValue, format, clearColor } = changes;
    if (colorValue) {
      const colorValue = {
        hex: generateColor(this.colorValue).toHex(),
        hsbH: Math.round(generateColor(this.colorValue).toHsb().h),
        hsbS: Math.round(generateColor(this.colorValue).toHsb().s * 100),
        hsbB: Math.round(generateColor(this.colorValue).toHsb().b * 100),
        rgbR: Math.round(generateColor(this.colorValue).r),
        rgbG: Math.round(generateColor(this.colorValue).g),
        rgbB: Math.round(generateColor(this.colorValue).b),
        roundA: Math.round(generateColor(this.colorValue).roundA * 100)
      };
      this.validateForm.patchValue(colorValue);
    }

    if (format && this.format) {
      this.validateForm.get('isFormat')?.patchValue(this.format);
    }

    if (clearColor && this.clearColor) {
      this.validateForm.get('roundA')?.patchValue(0);
    }
  }
}
