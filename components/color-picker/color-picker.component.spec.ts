/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DebugElement, provideZoneChangeDetection, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriColorPickerComponent, TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import {
  TriColor,
  TriColorPickerFormatType,
  TriColorPickerTriggerType,
  TriPresetColor
} from 'ng-zorro-antd/color-picker/typings';
import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriFormModule } from 'ng-zorro-antd/form';

describe('color-picker', () => {
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

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestColorPickerComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriColorPickerComponent));
  });

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
    />
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

describe('nz-color-picker with presets', () => {
  let fixture: ComponentFixture<TriTestColorPickerPresetsComponent>;
  let testComponent: TriTestColorPickerPresetsComponent;
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
      providers: [provideNoopAnimations(), provideZoneChangeDetection()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerPresetsComponent);
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

  it('should render presets when provided', fakeAsync(() => {
    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const presetWrapper = overlayContainerElement.querySelector('.ant-color-picker-presets-wrapper');
    expect(presetWrapper).toBeTruthy();

    const collapseItems = overlayContainerElement.querySelectorAll('.ant-collapse-item');
    expect(collapseItems.length).toBe(2);
  }));

  it('should not render presets when null', fakeAsync(() => {
    testComponent.presets = null;
    fixture.detectChanges();

    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const presetWrapper = overlayContainerElement.querySelector('.ant-color-picker-presets-wrapper');
    expect(presetWrapper).toBeFalsy();
  }));

  it('should handle preset color selection', fakeAsync(() => {
    spyOn(testComponent, 'onColorChange');

    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const firstPresetColor = overlayContainerElement.querySelector(
      '.ant-color-picker-presets-items .ant-color-picker-color-block'
    );
    expect(firstPresetColor).toBeTruthy();

    dispatchMouseEvent(firstPresetColor as Element, 'click');
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();

    expect(testComponent.onColorChange).toHaveBeenCalled();
  }));

  it('should toggle preset groups', fakeAsync(() => {
    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const collapseItems = overlayContainerElement.querySelectorAll('.ant-collapse-item');
    const secondPanel = collapseItems[1] as HTMLElement;

    // Initially, second group should be collapsed (no active class)
    expect(secondPanel.classList.contains('ant-collapse-item-active')).toBeFalse();

    // Find and click the collapse header to toggle
    const collapseHeader = secondPanel.querySelector('.ant-collapse-header');
    if (collapseHeader) {
      dispatchMouseEvent(collapseHeader, 'click');
      fixture.detectChanges();
      tick(300); // Wait for collapse animation
      fixture.detectChanges();
    }
  }));
});

@Component({
  imports: [TriColorPickerModule, TriFormModule, ReactiveFormsModule],
  template: `
    <form tri-form [formGroup]="validateForm">
      <tri-form-item>
        <tri-form-label [span]="4">color</tri-form-label>
        <tri-form-control [span]="16">
          <tri-color-picker formControlName="colorPicker" showText />
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

@Component({
  imports: [TriColorPickerModule],
  template: ` <tri-color-picker [presets]="presets" value="#1677ff" (onChange)="onColorChange($event)" /> `
})
export class TriTestColorPickerPresetsComponent {
  presets: TriPresetColor[] | null = [
    {
      label: 'Basic Colors',
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      defaultOpen: true,
      key: 'basic'
    },
    {
      label: 'Advanced Colors',
      colors: ['#ffff00', '#ff00ff', '#00ffff'],
      defaultOpen: false,
      key: 'advanced'
    }
  ];

  onColorChange(event: { color: TriColor; format: string }): void {
    console.log('Color changed:', event);
  }
}

describe('nz-color-picker form size', () => {
  let fixture: ComponentFixture<TriTestColorPickerFormSizeComponent>;
  let colorPickerElement: HTMLElement;
  let formSizeSignal: WritableSignal<TriSizeLDSType | undefined>;

  beforeEach(() => {
    formSizeSignal = signal<TriSizeLDSType | undefined>(undefined);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should apply size from NZ_FORM_SIZE signal', () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.detectChanges();

    formSizeSignal.set('large');
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-lg');
  });

  it('should apply small size from NZ_FORM_SIZE signal', () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.detectChanges();

    formSizeSignal.set('small');
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-sm');
  });

  it('should prioritize NZ_FORM_SIZE over nzSize input', () => {
    formSizeSignal.set('large');
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.componentInstance.size = 'small';
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-lg');
    expect(trigger?.classList).not.toContain('ant-color-picker-sm');
  });

  it('should use nzSize input when NZ_FORM_SIZE is not provided', () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.componentInstance.size = 'large';
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-lg');
  });

  it('should update size when NZ_FORM_SIZE signal changes', () => {
    formSizeSignal.set('small');
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.detectChanges();

    let trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-sm');

    formSizeSignal.set('large');
    fixture.detectChanges();

    trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-lg');
    expect(trigger?.classList).not.toContain('ant-color-picker-sm');
  });

  it('should apply default size when NZ_FORM_SIZE is undefined', () => {
    formSizeSignal.set(undefined);
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).not.toContain('ant-color-picker-lg');
    expect(trigger?.classList).not.toContain('ant-color-picker-sm');
  });
});

@Component({
  imports: [TriColorPickerModule],
  template: `<tri-color-picker [size]="size" />`
})
export class TriTestColorPickerFormSizeComponent {
  size: TriSizeLDSType = 'default';
}
