/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef, provideZoneChangeDetection, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TriSizeLDSType, TriVariant } from 'ng-zorro-antd/core/types';

import { TriInputModule } from './input.module';

describe('input-wrapper', () => {
  let component: InputWithAffixesAndAddonsTestComponent;
  let fixture: ComponentFixture<InputWithAffixesAndAddonsTestComponent>;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithAffixesAndAddonsTestComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should be apply affix classes', () => {
    expect(component.withPropAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper');
    expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper');
  });

  it('should be apply addon classes', () => {
    expect(component.withPropAddons().nativeElement.classList).toContain('ant-input-group-wrapper');
    expect(component.withContentAddons().nativeElement.classList).toContain('ant-input-group-wrapper');
  });

  it('should be apply mix classes', () => {
    expect(component.withPropMix().nativeElement.classList).toContain('ant-input-group-wrapper');
    expect(component.withPropMix().nativeElement.classList).toContain('ant-input-group-wrapper');
    expect(component.withContentMix().nativeElement.classList).toContain('ant-input-group-wrapper');
    expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper')).toBeTruthy();
  });

  it('should be not apply affix or addon classes when only input is present', () => {
    expect(component.onlyInput().nativeElement.classList).not.toContain('ant-input-group-wrapper');
    expect(component.onlyInput().nativeElement.classList).not.toContain('ant-input-affix-wrapper');
  });

  it('should be apply size class', () => {
    component.size = 'large';
    fixture.detectChanges();
    expect(component.withPropAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-lg');
    expect(component.withPropAddons().nativeElement.classList).toContain('ant-input-group-wrapper-lg');
    component.size = 'small';
    fixture.detectChanges();
    expect(component.withPropAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-sm');
    expect(component.withPropAddons().nativeElement.classList).toContain('ant-input-group-wrapper-sm');
  });

  it('should be apply disabled class', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-disabled');
  });

  it('should be apply readonly class', () => {
    component.readonly = true;
    fixture.detectChanges();
    expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-readonly');
  });

  describe('should be apply variant class', () => {
    it('filled', () => {
      fixture.detectChanges();
      expect(component.withContentAffixes().nativeElement.classList).not.toContain('ant-input-affix-wrapper-filled');
      expect(component.withContentAddons().nativeElement.classList).not.toContain('ant-input-group-wrapper-filled');
      expect(component.withContentMix().nativeElement.classList).not.toContain('ant-input-group-wrapper-filled');
      expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-filled')).toBeFalsy();
      component.variant = 'filled';
      fixture.detectChanges();
      expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-filled');
      expect(component.withContentAddons().nativeElement.classList).toContain('ant-input-group-wrapper-filled');
      expect(component.withContentMix().nativeElement.classList).toContain('ant-input-group-wrapper-filled');
      expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-filled')).toBeTruthy();
    });

    it('borderless', () => {
      fixture.detectChanges();
      expect(component.withContentAffixes().nativeElement.classList).not.toContain(
        'ant-input-affix-wrapper-borderless'
      );
      expect(component.withContentAddons().nativeElement.classList).not.toContain('ant-input-group-wrapper-borderless');
      expect(component.withContentMix().nativeElement.classList).not.toContain('ant-input-group-wrapper-borderless');
      expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-borderless')).toBeFalsy();
      component.variant = 'borderless';
      fixture.detectChanges();
      expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-borderless');
      expect(component.withContentAddons().nativeElement.classList).toContain('ant-input-group-wrapper-borderless');
      expect(component.withContentMix().nativeElement.classList).toContain('ant-input-group-wrapper-borderless');
      expect(
        component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-borderless')
      ).toBeTruthy();
    });

    it('underlined', () => {
      fixture.detectChanges();
      expect(component.withContentAffixes().nativeElement.classList).not.toContain(
        'ant-input-affix-wrapper-underlined'
      );
      expect(component.withContentAddons().nativeElement.classList).not.toContain('ant-input-group-wrapper-underlined');
      expect(component.withContentMix().nativeElement.classList).not.toContain('ant-input-group-wrapper-underlined');
      expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-underlined')).toBeFalsy();
      component.variant = 'underlined';
      fixture.detectChanges();
      expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-underlined');
      expect(component.withContentAddons().nativeElement.classList).toContain('ant-input-group-wrapper-underlined');
      expect(component.withContentMix().nativeElement.classList).toContain('ant-input-group-wrapper-underlined');
      expect(
        component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-underlined')
      ).toBeTruthy();
    });
  });

  it('should be handle focus / blur', () => {
    let inputElement = component.withContentAffixes().nativeElement.querySelector('input')!;
    inputElement.focus();
    expect(component.withContentAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-focused');
    inputElement.blur();
    expect(component.withContentAffixes().nativeElement.classList).not.toContain('ant-input-affix-wrapper-focused');

    inputElement = component.withContentMix().nativeElement.querySelector('input')!;
    inputElement.focus();
    expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-focused')).toBeTruthy();
    inputElement.blur();
    expect(component.withContentMix().nativeElement.querySelector('.ant-input-affix-wrapper-focused')).toBeFalsy();
  });
});

describe('input-wrapper allow clear', () => {
  let component: InputAllowClearTestComponent;
  let fixture: ComponentFixture<InputAllowClearTestComponent>;
  let clearIconElement: HTMLElement;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputAllowClearTestComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    clearIconElement = fixture.nativeElement.querySelector('.ant-input-clear-icon');
  });

  it('should be show clear icon when input has value', async () => {
    expect(clearIconElement.classList).toContain('ant-input-clear-icon-hidden');
    component.value = 'test';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(clearIconElement.classList).not.toContain('ant-input-clear-icon-hidden');
    component.value = '';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(clearIconElement.classList).toContain('ant-input-clear-icon-hidden');
  });

  it('should be clear input value when click clear icon', () => {
    component.value = 'test';
    fixture.detectChanges();
    clearIconElement.click();
    fixture.detectChanges();
    expect(component.value).toBe('');
    expect(clearIconElement.classList).toContain('ant-input-clear-icon-hidden');
  });

  it('should be not show clear icon when input is disabled or readonly', () => {
    component.value = 'test';
    component.disabled = true;
    component.readonly = false;
    fixture.detectChanges();
    expect(clearIconElement.classList).toContain('ant-input-clear-icon-hidden');
    component.disabled = false;
    component.readonly = true;
    fixture.detectChanges();
    expect(clearIconElement.classList).toContain('ant-input-clear-icon-hidden');
  });

  it('should be not show clear icon when nzAllowClear is false', () => {
    component.value = 'test';
    component.allowClear = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ant-input-clear-icon')).toBeFalsy();
  });

  it('should be emit nzClear event when click clear icon', () => {
    spyOn(component, 'onClear');
    component.value = 'test';
    fixture.detectChanges();
    expect(component.onClear).not.toHaveBeenCalled();
    clearIconElement.click();
    fixture.detectChanges();
    expect(component.onClear).toHaveBeenCalled();
  });
});

@Component({
  imports: [TriInputModule, FormsModule],
  template: `
    <tri-input-wrapper [allowClear]="allowClear" (clear)="onClear()">
      <input tri-input [(ngModel)]="value" [disabled]="disabled" [readonly]="readonly" />
    </tri-input-wrapper>
  `
})
class InputAllowClearTestComponent {
  allowClear = true;
  disabled = false;
  readonly = false;
  value = '';

  onClear(): void {}
}

@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-wrapper #withPropAffixes prefix="Prefix" suffix="Suffix">
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
    </tri-input-wrapper>

    <tri-input-wrapper #withContentAffixes>
      <span inputPrefix>Prefix</span>
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
      <span inputSuffix>Suffix</span>
    </tri-input-wrapper>

    <tri-input-wrapper #withPropAddons addonBefore="Before" addonAfter="After">
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
    </tri-input-wrapper>

    <tri-input-wrapper #withContentAddons>
      <span inputAddonBefore>Before</span>
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
      <span inputAddonAfter>After</span>
    </tri-input-wrapper>

    <tri-input-wrapper #withPropMix addonBefore="Before" addonAfter="After" prefix="Prefix" suffix="Suffix">
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
    </tri-input-wrapper>

    <tri-input-wrapper #withContentMix>
      <span inputAddonBefore>Before</span>
      <span inputPrefix>Prefix</span>
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
      <span inputSuffix>Suffix</span>
      <span inputAddonAfter>After</span>
    </tri-input-wrapper>

    <tri-input-wrapper #onlyInput>
      <input tri-input [size]="size" [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
    </tri-input-wrapper>
  `
})
class InputWithAffixesAndAddonsTestComponent {
  size: TriSizeLDSType = 'default';
  disabled = false;
  readonly = false;
  variant: TriVariant = 'outlined';

  readonly withPropAffixes = viewChild.required('withPropAffixes', { read: ElementRef });
  readonly withContentAffixes = viewChild.required('withContentAffixes', { read: ElementRef });
  readonly withPropAddons = viewChild.required('withPropAddons', { read: ElementRef });
  readonly withContentAddons = viewChild.required('withContentAddons', { read: ElementRef });
  readonly withPropMix = viewChild.required('withPropMix', { read: ElementRef });
  readonly withContentMix = viewChild.required('withContentMix', { read: ElementRef });
  readonly onlyInput = viewChild.required('onlyInput', { read: ElementRef });
}
