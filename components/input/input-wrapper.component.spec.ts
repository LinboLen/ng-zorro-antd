/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriVariant } from 'ng-zorro-antd/core/types';

import { TriInputModule } from './input.module';

describe('input-wrapper with affixes or addons', () => {
  let component: InputWithAffixesAndAddonsTestComponent;
  let fixture: ComponentFixture<InputWithAffixesAndAddonsTestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithAffixesAndAddonsTestComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should be apply affix classes', () => {
    expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper');
  });

  it('should be apply addon classes', () => {
    expect(component.withAddons().nativeElement.classList).toContain('ant-input-group-wrapper');
  });

  it('should be apply mix classes', () => {
    expect(component.withMix().nativeElement.classList).toContain('ant-input-group-wrapper');
    expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper')).toBeTruthy();
  });

  it('should be not apply affix or addon classes when only input is present', () => {
    expect(component.onlyInput().nativeElement.classList).not.toContain('ant-input-group-wrapper');
    expect(component.onlyInput().nativeElement.classList).not.toContain('ant-input-affix-wrapper');
  });

  it('should be apply disabled class', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-disabled');
  });

  it('should be apply readonly class', () => {
    component.readonly = true;
    fixture.detectChanges();
    expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-readonly');
  });

  describe('should be apply variant class', () => {
    it('filled', () => {
      fixture.detectChanges();
      expect(component.withAffixes().nativeElement.classList).not.toContain('ant-input-affix-wrapper-filled');
      expect(component.withAddons().nativeElement.classList).not.toContain('ant-input-group-wrapper-filled');
      expect(component.withMix().nativeElement.classList).not.toContain('ant-input-group-wrapper-filled');
      expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-filled')).toBeFalsy();
      component.variant = 'filled';
      fixture.detectChanges();
      expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-filled');
      expect(component.withAddons().nativeElement.classList).toContain('ant-input-group-wrapper-filled');
      expect(component.withMix().nativeElement.classList).toContain('ant-input-group-wrapper-filled');
      expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-filled')).toBeTruthy();
    });

    it('borderless', () => {
      fixture.detectChanges();
      expect(component.withAffixes().nativeElement.classList).not.toContain('ant-input-affix-wrapper-borderless');
      expect(component.withAddons().nativeElement.classList).not.toContain('ant-input-group-wrapper-borderless');
      expect(component.withMix().nativeElement.classList).not.toContain('ant-input-group-wrapper-borderless');
      expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-borderless')).toBeFalsy();
      component.variant = 'borderless';
      fixture.detectChanges();
      expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-borderless');
      expect(component.withAddons().nativeElement.classList).toContain('ant-input-group-wrapper-borderless');
      expect(component.withMix().nativeElement.classList).toContain('ant-input-group-wrapper-borderless');
      expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-borderless')).toBeTruthy();
    });

    it('underlined', () => {
      fixture.detectChanges();
      expect(component.withAffixes().nativeElement.classList).not.toContain('ant-input-affix-wrapper-underlined');
      expect(component.withAddons().nativeElement.classList).not.toContain('ant-input-group-wrapper-underlined');
      expect(component.withMix().nativeElement.classList).not.toContain('ant-input-group-wrapper-underlined');
      expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-underlined')).toBeFalsy();
      component.variant = 'underlined';
      fixture.detectChanges();
      expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-underlined');
      expect(component.withAddons().nativeElement.classList).toContain('ant-input-group-wrapper-underlined');
      expect(component.withMix().nativeElement.classList).toContain('ant-input-group-wrapper-underlined');
      expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-underlined')).toBeTruthy();
    });
  });

  it('should be handle focus / blur', () => {
    let inputElement = component.withAffixes().nativeElement.querySelector('input')!;
    inputElement.focus();
    expect(component.withAffixes().nativeElement.classList).toContain('ant-input-affix-wrapper-focused');
    inputElement.blur();
    expect(component.withAffixes().nativeElement.classList).not.toContain('ant-input-affix-wrapper-focused');

    inputElement = component.withMix().nativeElement.querySelector('input')!;
    inputElement.focus();
    expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-focused')).toBeTruthy();
    inputElement.blur();
    expect(component.withMix().nativeElement.querySelector('.ant-input-affix-wrapper-focused')).toBeFalsy();
  });
});

@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-wrapper #withAffixes>
      <span inputPrefix>Prefix</span>
      <input tri-input [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
      <span inputSuffix>Suffix</span>
    </tri-input-wrapper>

    <tri-input-wrapper #withAddons>
      <span inputAddonBefore>Before</span>
      <input tri-input [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
      <span inputAddonAfter>After</span>
    </tri-input-wrapper>

    <tri-input-wrapper #withMix>
      <span inputAddonBefore>Before</span>
      <span inputPrefix>Prefix</span>
      <input tri-input [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
      <span inputSuffix>Suffix</span>
      <span inputAddonAfter>After</span>
    </tri-input-wrapper>

    <tri-input-wrapper #onlyInput>
      <input tri-input [variant]="variant" [disabled]="disabled" [readonly]="readonly" />
    </tri-input-wrapper>
  `
})
class InputWithAffixesAndAddonsTestComponent {
  disabled = false;
  readonly = false;
  variant: TriVariant = 'outlined';

  readonly withAffixes = viewChild.required('withAffixes', { read: ElementRef });
  readonly withAddons = viewChild.required('withAddons', { read: ElementRef });
  readonly withMix = viewChild.required('withMix', { read: ElementRef });
  readonly onlyInput = viewChild.required('onlyInput', { read: ElementRef });
}
