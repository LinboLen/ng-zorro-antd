/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, DebugElement, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriColorPickerComponent, TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import {
  TriColor,
  TriColorPickerFormatType,
  TriColorPickerTriggerType,
  TriPresetColor
} from 'ng-zorro-antd/color-picker/typings';
import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TRI_FORM_SIZE } from 'ng-zorro-antd/core/form';
import { dispatchFakeEvent, dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
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
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
  }

  async function openFormatSelect(): Promise<NodeListOf<Element>> {
    const select = overlayContainerElement.querySelector('.ant-color-picker-format-select nz-select')!;
    dispatchFakeEvent(select, 'click');
    waitingForTooltipToggling();
    await fixture.whenStable();
    fixture.detectChanges();
    return document.querySelectorAll('nz-option-item');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });

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

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => vi.useRealTimers());

  it('color-picker basic', () => {
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(22, 119, 255)');
  });

  it('color-picker nzValue', () => {
    testComponent.value.set('#ff6600');
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(255, 102, 0)');
  });

  it('color-picker nzDefaultValue', () => {
    testComponent.defaultValue.set('#ff6600');
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(255, 102, 0)');
  });

  it('color-picker nzSize', () => {
    testComponent.size.set('small');
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-trigger').classList).toContain(
      'ant-color-picker-sm'
    );
    testComponent.size.set('large');
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-trigger').classList).toContain(
      'ant-color-picker-lg'
    );
  });

  it('color-picker nzDisabled', () => {
    testComponent.disabled.set(true);
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-color-picker-disabled');
  });

  it('color-picker nzShowText', () => {
    testComponent.showText.set(true);
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-trigger-text').innerText).toBe('#1677ff');
  });

  it('color-picker nzTrigger click', () => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-popover-inner-content')).not.toBeNull();
  });

  it('color-picker nzTrigger hover', () => {
    testComponent.trigger.set('hover');
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'mouseenter');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-popover-inner-content')).not.toBeNull();
  });

  it('color-picker nzOpen', () => {
    testComponent.open.set(true);
    fixture.detectChanges();
    expect(overlayContainerElement.querySelector('.ant-popover-inner-content')).not.toBeNull();
  });

  it('color-picker should default to bottomLeft placement with corner fallbacks (#9711)', () => {
    testComponent.open.set(true);
    fixture.detectChanges();
    waitingForTooltipToggling();

    const popover = overlayContainerElement.querySelector('.ant-popover');
    expect(popover).not.toBeNull();
    expect(popover!.classList).toContain('ant-popover-placement-bottomLeft');

    const colorPicker = resultEl.componentInstance as TriColorPickerComponent & { popoverPlacements: string[] };
    expect(colorPicker.popoverPlacements).toEqual(['bottomLeft', 'bottomRight', 'topLeft', 'topRight']);
  });

  it('color-picker should remain fully visible when triggered near the bottom-right edge (#9711)', () => {
    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger') as HTMLElement;
    trigger.style.position = 'fixed';
    trigger.style.right = '0px';
    trigger.style.bottom = '0px';
    fixture.detectChanges();

    testComponent.open.set(true);
    fixture.detectChanges();
    waitingForTooltipToggling();

    const popover = overlayContainerElement.querySelector('.ant-popover') as HTMLElement;
    expect(popover).not.toBeNull();

    const rect = popover.getBoundingClientRect();
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.top).toBeGreaterThanOrEqual(0);
  });

  it('color-picker nzAllowClear', () => {
    testComponent.allowClear.set(true);
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-clear')).not.toBeNull();
  });

  it('color-picker nzTitle', () => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-title-content')?.textContent?.trim()).toBe(
      'Color Picker'
    );
  });

  it('color-picker nzFlipFlop', () => {
    testComponent.isFlipFlop.set(true);
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('button')).not.toBeNull();
  });

  it('color-picker nzFormat', () => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-hex-input')).not.toBeNull();
    testComponent.format.set('hsb');
    fixture.detectChanges();
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-hsb-input')).not.toBeNull();
    testComponent.format.set('rgb');
    fixture.detectChanges();
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-rgb-input')).not.toBeNull();
  });

  it('color-picker nzOnOpenChange', () => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(testComponent.openChange).toBe(true);
  });

  it('color-picker nzOnClear', async () => {
    testComponent.allowClear.set(true);
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    const clear = overlayContainerElement.querySelector('.ant-color-picker-clear');
    if (clear) {
      dispatchMouseEvent(clear, 'click');
      fixture.detectChanges();
      waitingForTooltipToggling();
      await fixture.whenStable();
      fixture.detectChanges();
      const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
      expect(colorDom.style.backgroundColor).toBe('rgba(22, 119, 255, 0)');
    }
  });

  it('color-picker nzOnChange', () => {
    const colorPicker = resultEl.componentInstance as TriColorPickerComponent;

    colorPicker.formatChange({ color: 'hsb(180, 91%, 100%)', format: 'hsb' });

    expect(testComponent.colorChange?.format).toBe('hsb');
    expect(testComponent.colorChange?.color.toHsbString()).toBe('hsb(180, 91%, 100%)');
  });

  it('color-picker disableAlpha', () => {
    testComponent.alphaDisabled.set(true);
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    expect(overlayContainerElement.querySelector('.ant-color-picker-slider-alpha')).toBeNull();
  });

  it('nz-color-format disableAlpha', async () => {
    testComponent.alphaDisabled.set(true);
    fixture.detectChanges();
    const dom = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(dom, 'click');
    waitingForTooltipToggling();
    const items = await openFormatSelect();
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
      dispatchMouseEvent(item, 'click');
      waitingForTooltipToggling();
      const alphaInputElement = overlayContainerElement.querySelector('.ant-color-picker-alpha-input') as Element;
      expect(alphaInputElement).toBeNull();
    });
  });
});

@Component({
  imports: [TriButtonModule, TriColorPickerModule],
  template: `
    <tri-color-picker
      [value]="value()"
      [size]="size()"
      [defaultValue]="defaultValue()"
      [showText]="showText()"
      [disabled]="disabled()"
      [trigger]="trigger()"
      [format]="format()"
      [allowClear]="allowClear()"
      [open]="open()"
      [disabledAlpha]="alphaDisabled()"
      (onChange)="onChange($event)"
      (onFormatChange)="onFormatChange($event)"
      (onClear)="onClear($event)"
      (onOpenChange)="onOpenChange($event)"
      title="Color Picker"
      [flipFlop]="isFlipFlop() ? flipFlop : null"
    />
    <ng-template #flipFlop>
      <button tri-button type="primary">Color</button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestColorPickerComponent {
  readonly format = signal<TriColorPickerFormatType | null>(null);
  readonly value = signal('');
  readonly size = signal<TriSizeLDSType>('default');
  readonly defaultValue = signal('');
  readonly trigger = signal<TriColorPickerTriggerType>('click');
  readonly showText = signal<boolean>(false);
  readonly allowClear = signal<boolean>(false);
  readonly disabled = signal<boolean>(false);
  readonly alphaDisabled = signal<boolean>(false);
  readonly open = signal<boolean>(false);

  readonly isFlipFlop = signal(false);

  isClear = false;
  openChange = false;
  colorChange: { color: TriColor; format: string } | null = null;
  formatChange: TriColorPickerFormatType | null = null;
  onChange(value: { color: TriColor; format: string }): void {
    this.colorChange = value;
    this.value.set(value.color.toRgbString());
  }
  onFormatChange(value: TriColorPickerFormatType): void {
    this.formatChange = value;
  }
  onClear(value: boolean): void {
    this.isClear = value;
    if (value) {
      this.value.set('rgba(22, 119, 255, 0)');
    }
  }
  onOpenChange(value: boolean): void {
    this.openChange = value;
    this.open.set(value);
  }
}

describe('nz-color-picker form', () => {
  let fixture: ComponentFixture<TriTestColorPickerFormComponent>;
  let component: TriTestColorPickerFormComponent;
  let resultEl: DebugElement;

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriColorPickerComponent));
  });

  it('color-picker form base', () => {
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner').style.backgroundColor).toBe(
      'rgb(255, 102, 0)'
    );
  });

  it('color-picker form disable', () => {
    component.disable();
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-color-picker-disabled');
    component.enable();
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).not.toContain('ant-color-picker-disabled');
  });
});

describe('nz-color-picker with presets', () => {
  let fixture: ComponentFixture<TriTestColorPickerPresetsComponent>;
  let testComponent: TriTestColorPickerPresetsComponent;
  let resultEl: DebugElement;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function waitingForTooltipToggling(): void {
    fixture.detectChanges();
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerPresetsComponent);
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

  it('should render presets when provided', () => {
    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const presetWrapper = overlayContainerElement.querySelector('.ant-color-picker-presets-wrapper');
    expect(presetWrapper).not.toBeNull();

    const collapseItems = overlayContainerElement.querySelectorAll('.ant-collapse-item');
    expect(collapseItems.length).toBe(2);
  });

  it('should not render presets when null', () => {
    testComponent.presets.set(null);
    fixture.detectChanges();

    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const presetWrapper = overlayContainerElement.querySelector('.ant-color-picker-presets-wrapper');
    expect(presetWrapper).toBeNull();
  });

  it('should handle preset color selection', async () => {
    vi.spyOn(testComponent, 'onColorChange');

    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const firstPresetColor = overlayContainerElement.querySelector(
      '.ant-color-picker-presets-items .ant-color-picker-color-block'
    );
    expect(firstPresetColor).not.toBeNull();

    dispatchMouseEvent(firstPresetColor as Element, 'click');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(testComponent.onColorChange).toHaveBeenCalled();
  });

  it('should toggle preset groups', () => {
    const trigger = resultEl.nativeElement.querySelector('.ant-color-picker-trigger');
    dispatchMouseEvent(trigger, 'click');
    waitingForTooltipToggling();

    const collapseItems = overlayContainerElement.querySelectorAll('.ant-collapse-item');
    const secondPanel = collapseItems[1] as HTMLElement;

    // Initially, second group should be collapsed (no active class)
    expect(secondPanel.classList.contains('ant-collapse-item-active')).toBe(false);

    // Find and click the collapse header to toggle
    const collapseHeader = secondPanel.querySelector('.ant-collapse-header');
    if (collapseHeader) {
      dispatchMouseEvent(collapseHeader, 'click');
      fixture.detectChanges();
      vi.advanceTimersByTime(300); // Wait for collapse animation
      fixture.detectChanges();
    }
  });
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
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
  template: ` <tri-color-picker [presets]="presets()" value="#1677ff" (onChange)="onColorChange($event)" /> `
})
export class TriTestColorPickerPresetsComponent {
  readonly presets = signal<TriPresetColor[] | null>([
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
  ]);

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
      providers: [provideNzNoAnimation(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
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
      providers: [provideNzNoAnimation(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
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
      providers: [provideNzNoAnimation(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.componentInstance.size.set('small');
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-lg');
    expect(trigger?.classList).not.toContain('ant-color-picker-sm');
  });

  it('should use nzSize input when NZ_FORM_SIZE is not provided', () => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    fixture = TestBed.createComponent(TriTestColorPickerFormSizeComponent);
    colorPickerElement = fixture.debugElement.query(By.directive(TriColorPickerComponent)).nativeElement;
    fixture.componentInstance.size.set('large');
    fixture.detectChanges();

    const trigger = colorPickerElement.querySelector('.ant-color-picker-trigger');
    expect(trigger?.classList).toContain('ant-color-picker-lg');
  });

  it('should update size when NZ_FORM_SIZE signal changes', () => {
    formSizeSignal.set('small');
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
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
      providers: [provideNzNoAnimation(), { provide: TRI_FORM_SIZE, useValue: formSizeSignal }]
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
  template: `<tri-color-picker [size]="size()" />`
})
export class TriTestColorPickerFormSizeComponent {
  readonly size = signal<TriSizeLDSType>('default');
}
