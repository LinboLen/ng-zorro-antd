/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  inject
} from '@angular/core';

import { PickerComponent } from './components/picker.component';
import { SliderComponent } from './components/slider.component';
import { Color } from './interfaces/color';
import { ColorGenInput, ColorValue, HsbaColorType } from './interfaces/type';
import { NgAntdColorBlockComponent } from './ng-antd-color-block.component';
import { defaultColor, generateColor } from './util/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '',
  imports: [PickerComponent, SliderComponent, NgAntdColorBlockComponent, NgTemplateOutlet],
  template: `
    <div class="tri-color-picker-inner-content">
      <div class="tri-color-picker-panel" [class.tri-color-picker-panel-disabled]="disabled">
        @if (panelRenderHeader) {
          <ng-template [ngTemplateOutlet]="panelRenderHeader"></ng-template>
        }
        <color-picker
          [color]="colorValue"
          (onChange)="handleChange($event)"
          [disabled]="disabled"
          (onChangeComplete)="onChangeComplete.emit($event)"
        ></color-picker>
        <div class="tri-color-picker-slider-container">
          <div
            class="tri-color-picker-slider-group"
            [class.tri-color-picker-slider-group-disabled-alpha]="disabledAlpha"
          >
            <color-slider
              [color]="colorValue"
              [value]="'hsl(' + colorValue?.toHsb()?.h + ',100%, 50%)'"
              [gradientColors]="hueColor"
              (onChange)="handleChange($event, 'hue')"
              [disabled]="disabled"
              (onChangeComplete)="onChangeComplete.emit($event)"
            ></color-slider>
            @if (!disabledAlpha) {
              <color-slider
                type="alpha"
                [color]="colorValue"
                [value]="toRgbString"
                [gradientColors]="gradientColors"
                (onChange)="handleChange($event, 'alpha')"
                [disabled]="disabled"
                (onChangeComplete)="onChangeComplete.emit($event)"
              ></color-slider>
            }
          </div>
          <ng-antd-color-block [color]="toRgbString"></ng-antd-color-block>
        </div>
      </div>
      @if (panelRenderFooter) {
        <ng-template [ngTemplateOutlet]="panelRenderFooter"></ng-template>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-color-picker-inner'
  }
})
export class NgAntdColorPickerComponent implements OnInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @Input() value: ColorValue;
  @Input() defaultValue: ColorValue;
  @Output() readonly onChange = new EventEmitter<{ color: Color; type?: HsbaColorType }>();
  @Output() readonly onChangeComplete = new EventEmitter<HsbaColorType>();
  @Input() panelRenderHeader: TemplateRef<void> | null = null;
  @Input() panelRenderFooter: TemplateRef<void> | null = null;
  @Input({ transform: booleanAttribute }) disabledAlpha: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  colorValue: Color | null = null;
  alphaColor: string = '';

  hueColor: string[] = [
    'rgb(255, 0, 0) 0%',
    'rgb(255, 255, 0) 17%',
    'rgb(0, 255, 0) 33%',
    'rgb(0, 255, 255) 50%',
    'rgb(0, 0, 255) 67%',
    'rgb(255, 0, 255) 83%',
    'rgb(255, 0, 0) 100%'
  ];

  gradientColors: string[] = ['rgba(255, 0, 4, 0) 0%', this.alphaColor];

  toRgbString: string = this.colorValue?.toRgbString() || '';

  ngOnInit(): void {
    this.setColorValue(this.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { value, defaultValue } = changes;
    if (value || defaultValue) {
      this.setColorValue(this.value);
    }
  }

  hasValue(value: ColorValue): boolean {
    return !!value;
  }

  setColorValue(color: ColorValue): void {
    let mergeState;
    if (this.hasValue(color)) {
      mergeState = color;
    } else if (this.hasValue(this.defaultValue)) {
      mergeState = this.defaultValue;
    } else {
      mergeState = defaultColor;
    }
    this.colorValue = generateColor(mergeState as ColorGenInput);
    this.setAlphaColor(this.colorValue);
    this.toRgbString = this.colorValue?.toRgbString() || '';
    this.cdr.detectChanges();
  }

  setAlphaColor(colorValue: Color): void {
    const rgb = generateColor(colorValue.toRgbString());
    this.alphaColor = rgb.toRgbString();
    this.gradientColors = ['rgba(255, 0, 4, 0) 0%', this.alphaColor];
    this.cdr.markForCheck();
  }

  handleChange(color: Color, type?: HsbaColorType): void {
    this.setColorValue(color);
    this.onChange.emit({ color, type });
  }
}
