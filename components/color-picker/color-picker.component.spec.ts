/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriColorPickerComponent, TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import { TriColor, TriColorPickerFormatType, TriColorPickerTriggerType } from 'ng-zorro-antd/color-picker/typings';
import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriFormModule } from 'ng-zorro-antd/form';

describe('nz-color-picker', () => {
  let fixture: ComponentFixture<TriTestColorPickerComponent>;
  let testComponent: TriTestColorPickerComponent;
  let resultEl: DebugElement;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function waitingForTooltipToggling(): void {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriColorPickerComponent));
  }));

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('color-picker basic', () => {
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(22, 119, 255)');
  });

  it('color-picker nzValue', () => {
    testComponent.value = '#ff6600';
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(255, 102, 0)');
  });

  it('color-picker nzDefaultValue', () => {
    testComponent.defaultValue = '#ff6600';
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(255, 102, 0)');
  });

  it('color-picker nzSize', () => {
    testComponent.size = 'small';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-trigger').classList).toContain(
      'ant-color-picker-sm'
    );
    testComponent.size = 'large';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-trigger').classList).toContain(
      'ant-color-picker-lg'
    );
  });

  it('color-picker nzDisabled', () => {
    testComponent.disabled = true;
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-color-picker-disabled');
  });

  it('color-picker nzShowText', () => {
    testComponent.showText = true;
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-trigger-text').innerText).toBe('#1677ff');
  });

  it('color-picker nzTrigger click', fakeAsync(() => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(!!overlayContainerElement.querySelector('.ant-popover-inner-content')).toBeTrue();
  }));

  it('color-picker nzTrigger hover', fakeAsync(() => {
    testComponent.trigger = 'hover';
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'mouseenter');
    waitingForTooltipToggling();
    expect(!!overlayContainerElement.querySelector('.ant-popover-inner-content')).toBeTrue();
  }));

  it('color-picker nzOpen', () => {
    testComponent.open = true;
    fixture.detectChanges();
    expect(!!overlayContainerElement.querySelector('.ant-popover-inner-content')).toBeTrue();
  });

  it('color-picker nzAllowClear', fakeAsync(() => {
    testComponent.allowClear = true;
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(!!overlayContainerElement.querySelector('.ant-color-picker-clear')).toBeTrue();
  }));

  it('color-picker nzTitle', fakeAsync(() => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-title-content')?.textContent?.trim()).toBe(
      'Color Picker'
    );
  }));

  it('color-picker nzFlipFlop', () => {
    testComponent.isFlipFlop = true;
    fixture.detectChanges();
    expect(!!resultEl.nativeElement.querySelector('button')).toBeTrue();
  });

  it('color-picker nzFormat', fakeAsync(() => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(!!overlayContainerElement.querySelector('.ant-color-picker-hex-input')).toBeTrue();
    testComponent.format = 'hsb';
    fixture.detectChanges();
    waitingForTooltipToggling();
    expect(!!overlayContainerElement.querySelector('.ant-color-picker-hsb-input')).toBeTrue();
    testComponent.format = 'rgb';
    fixture.detectChanges();
    waitingForTooltipToggling();
    expect(!!overlayContainerElement.querySelector('.ant-color-picker-rgb-input')).toBeTrue();
  }));

  it('color-picker nzOnOpenChange', fakeAsync(() => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(testComponent.openChange).toBeTrue();
  }));

  it('color-picker nzOnClear', fakeAsync(() => {
    testComponent.allowClear = true;
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    const clear = overlayContainerElement.querySelector('.ant-color-picker-clear');
    if (clear) {
      dispatchMouseEvent(clear, 'click');
      fixture.detectChanges();
      waitingForTooltipToggling();
      const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
      expect(colorDom.style.backgroundColor).toBe('rgba(22, 119, 255, 0)');
      discardPeriodicTasks();
    }
  }));

  it('color-picker nzOnChange', fakeAsync(() => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    const select = overlayContainerElement.querySelector('nz-select') as Element;
    dispatchMouseEvent(select, 'click');
    waitingForTooltipToggling();
    const item = overlayContainerElement.querySelectorAll('nz-option-item')[1];
    dispatchMouseEvent(item, 'click');
    waitingForTooltipToggling();
    expect(testComponent.colorChange?.format).toBe('hsb');
    expect(testComponent.colorChange?.color.toHsbString()).toBe('hsb(215, 91%, 100%)');
    discardPeriodicTasks();
  }));

  it('color-picker disableAlpha', fakeAsync(() => {
    testComponent.alphaDisabled = true;
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    const alphaSlider = overlayContainerElement.querySelector('.ant-color-picker-slider-alpha') as Element;
    expect(alphaSlider).toBeFalsy();
    discardPeriodicTasks();
  }));

  it('nz-color-format disableAlpha', fakeAsync(() => {
    testComponent.alphaDisabled = true;
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    const select = overlayContainerElement.querySelector('nz-select') as Element;
    dispatchMouseEvent(select, 'click');
    waitingForTooltipToggling();
    const items = overlayContainerElement.querySelectorAll('nz-option-item');
    items.forEach(item => {
      dispatchMouseEvent(item, 'click');
      waitingForTooltipToggling();
      const alphaInputElement = overlayContainerElement.querySelector('.ant-color-picker-alpha-input') as Element;
      expect(alphaInputElement).toBeFalsy();
    });
    discardPeriodicTasks();
  }));
});

@Component({
  imports: [TriButtonModule, TriColorPickerModule],
  template: `
    <tri-color-picker
      [value]="value"
      [size]="size"
      [defaultValue]="defaultValue"
      [showText]="showText"
      [disabled]="disabled"
      [trigger]="trigger"
      [format]="format"
      [allowClear]="allowClear"
      [open]="open"
      [disabledAlpha]="alphaDisabled"
      (onChange)="onChange($event)"
      (onFormatChange)="onFormatChange($event)"
      (onClear)="onClear($event)"
      (onOpenChange)="onOpenChange($event)"
      title="Color Picker"
      [flipFlop]="isFlipFlop ? flipFlop : null"
    ></tri-color-picker>
    <ng-template #flipFlop>
      <button tri-button type="primary">Color</button>
    </ng-template>
  `
})
export class TriTestColorPickerComponent {
  format: TriColorPickerFormatType | null = null;
  value = '';
  size: TriSizeLDSType = 'default';
  defaultValue = '';
  trigger: TriColorPickerTriggerType = 'click';
  showText: boolean = false;
  allowClear: boolean = false;
  disabled: boolean = false;
  alphaDisabled: boolean = false;
  open: boolean = false;

  isFlipFlop = false;

  isClear = false;
  openChange = false;
  colorChange: { color: TriColor; format: string } | null = null;
  formatChange: TriColorPickerFormatType | null = null;
  onChange(value: { color: TriColor; format: string }): void {
    this.colorChange = value;
  }
  onFormatChange(value: TriColorPickerFormatType): void {
    this.formatChange = value;
  }
  onClear(value: boolean): void {
    this.isClear = value;
  }
  onOpenChange(value: boolean): void {
    this.openChange = value;
  }
}

describe('nz-color-picker form', () => {
  let fixture: ComponentFixture<TriTestColorPickerFormComponent>;
  let component: TriTestColorPickerFormComponent;
  let resultEl: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriColorPickerComponent));
  }));

  it('color-picker form base', fakeAsync(() => {
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner').style.backgroundColor).toBe(
      'rgb(255, 102, 0)'
    );
  }));

  it('color-picker form disable', fakeAsync(() => {
    component.disable();
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-color-picker-disabled');
    component.enable();
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).not.toContain('ant-color-picker-disabled');
  }));
});

@Component({
  imports: [TriColorPickerModule, TriFormModule, ReactiveFormsModule],
  template: `
    <form tri-form [formGroup]="validateForm">
      <tri-form-item>
        <tri-form-label [span]="4">color</tri-form-label>
        <tri-form-control [span]="16">
          <tri-color-picker formControlName="colorPicker" showText></tri-color-picker>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriTestColorPickerFormComponent {
  validateForm = new FormGroup({
    colorPicker: new FormControl('#ff6600')
  });

  disable(): void {
    this.validateForm.disable();
  }

  enable(): void {
    this.validateForm.enable();
  }
}
