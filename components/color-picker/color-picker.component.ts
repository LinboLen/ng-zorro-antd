/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriPopoverDirective } from 'ng-zorro-antd/popover';

import { TriColorBlockComponent } from './color-block.component';
import { TriColorFormatComponent } from './color-format.component';
import { NgAntdColorPickerModule } from './src/ng-antd-color-picker.module';
import { defaultColor, generateColor } from './src/util/util';
import { TriColor, TriColorPickerFormatType, TriColorPickerTriggerType, TriPresetColor } from './typings';

@Component({
  selector: 'tri-color-picker',
  exportAs: 'triColorPicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgAntdColorPickerModule,
    TriPopoverDirective,
    TriColorBlockComponent,
    TriColorFormatComponent,
    NgTemplateOutlet,
    TriStringTemplateOutletDirective
  ],
  template: `
    <div
      [class.tri-color-picker-trigger]="!flipFlop"
      [class.tri-color-picker-sm]="size === 'small'"
      [class.tri-color-picker-lg]="size === 'large'"
      tri-popover
      [popoverContent]="colorPicker"
      [popoverTrigger]="!disabled ? trigger : null"
      [popoverVisible]="open"
      (popoverVisibleChange)="onOpenChange.emit($event)"
    >
      @if (!flipFlop) {
        <tri-color-block [color]="blockColor" [size]="size" />
      } @else {
        <ng-template [ngTemplateOutlet]="flipFlop" />
      }
      @if (showText && !!showText && !flipFlop) {
        <div class="tri-color-picker-trigger-text">
          {{ showText }}
        </div>
      }
    </div>
    <ng-template #colorPicker>
      <ng-antd-color-picker
        [value]="blockColor"
        [defaultValue]="defaultValue"
        [disabled]="disabled"
        [panelRenderHeader]="panelRenderHeader"
        [panelRenderFooter]="panelRenderFooter"
        [disabledAlpha]="disabledAlpha"
        [presets]="presets"
        (onChange)="colorChange($event)"
      />
    </ng-template>
    <ng-template #nzPanelRenderHeader>
      @if (title || allowClear) {
        <div class="tri-color-picker-title">
          <div class="tri-color-picker-title-content">
            <ng-template [stringTemplateOutlet]="title">{{ title }}</ng-template>
          </div>
          @if (allowClear) {
            <div class="tri-color-picker-clear" (click)="clearColorHandle()"></div>
          }
        </div>
      }
    </ng-template>
    <ng-template #nzPanelRenderFooter>
      <tri-color-format
        [colorValue]="blockColor"
        [clearColor]="clearColor"
        [format]="format"
        [disabledAlpha]="disabledAlpha"
        (formatChange)="formatChange($event)"
        (onFormatChange)="onFormatChange.emit($event)"
      />
    </ng-template>
  `,
  host: {
    class: 'tri-color-picker-inline',
    '[class.tri-color-picker-disabled]': `disabled`
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriColorPickerComponent),
      multi: true
    }
  ]
})
export class TriColorPickerComponent implements OnInit, OnChanges, ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  @Input() format: TriColorPickerFormatType | null = null;
  @Input() value: string | TriColor = '';
  @Input() size: TriSizeLDSType = 'default';
  @Input() defaultValue: string | TriColor = '';
  @Input() trigger: TriColorPickerTriggerType = 'click';
  @Input() title: TemplateRef<void> | string = '';
  @Input() flipFlop: TemplateRef<void> | null = null;
  @Input({ transform: booleanAttribute }) showText: boolean = false;
  @Input({ transform: booleanAttribute }) open: boolean = false;
  @Input({ transform: booleanAttribute }) allowClear: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) disabledAlpha: boolean = false;
  @Input() presets: TriPresetColor[] | null = null;
  @Output() readonly onChange = new EventEmitter<{ color: TriColor; format: string }>();
  @Output() readonly onFormatChange = new EventEmitter<TriColorPickerFormatType>();
  @Output() readonly onClear = new EventEmitter<boolean>();
  @Output() readonly onOpenChange = new EventEmitter<boolean>();

  private isNzDisableFirstChange: boolean = true;
  blockColor: string = '';
  clearColor: boolean = false;
  _showText: string = defaultColor.toHexString();
  formControl = this.formBuilder.control('');

  _onChange: (value: string) => void = () => {};

  writeValue(value: string): void {
    this.value = value;
    this.getBlockColor();
    this.formControl.patchValue(value);
  }

  registerOnChange(fn: TriSafeAny): void {
    this._onChange = fn;
  }

  registerOnTouched(): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.getBlockColor();
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (value) {
        let color = value;
        if (this.format === 'hex') {
          color =
            generateColor(value).getAlpha() < 1
              ? generateColor(value).toHex8String()
              : generateColor(value).toHexString();
        } else if (this.format === 'hsb') {
          color = generateColor(value).toHsbString();
        } else if (this.format === 'rgb') {
          color = generateColor(value).toRgbString();
        }
        this._showText = color;
        this._onChange(color);
        this.cdr.markForCheck();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzValue, nzDefaultValue } = changes;
    if (nzValue || nzDefaultValue) {
      this.getBlockColor();
    }
  }

  clearColorHandle(): void {
    this.clearColor = true;
    this.onClear.emit(true);
    this.cdr.markForCheck();
  }

  getBlockColor(): void {
    if (this.value) {
      this.blockColor = generateColor(this.value).toRgbString();
    } else if (this.defaultValue) {
      this.blockColor = generateColor(this.defaultValue).toRgbString();
    } else {
      this.blockColor = defaultColor.toHexString();
    }
  }

  colorChange(value: { color: TriColor }): void {
    this.blockColor = value.color.getAlpha() < 1 ? value.color.toHex8String() : value.color.toHexString();
    this.clearColor = false;
    this.onChange.emit({ color: value.color, format: this.format ?? 'hex' });
    this.cdr.markForCheck();
  }

  formatChange(value: { color: string; format: TriColorPickerFormatType }): void {
    this.value = value.color;
    this.clearColor = false;
    this.getBlockColor();
    this.onChange.emit({ color: generateColor(value.color), format: value.format });
    this.formControl.patchValue(value.color);
    this.cdr.markForCheck();
  }
}
