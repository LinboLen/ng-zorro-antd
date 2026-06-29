/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { expect, vi } from 'vitest';

import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

import { TriInputSearchDirective, TriInputSearchEvent } from './input-search.directive';
import { TriInputModule } from './input.module';

describe('input-search', () => {
  let component: InputSearchTestComponent;
  let fixture: ComponentFixture<InputSearchTestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSearchTestComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should be apply classes', () => {
    const searchElement: HTMLElement = fixture.debugElement.query(By.directive(TriInputSearchDirective)).nativeElement;
    expect(searchElement.classList).toContain('ant-input-search');
    expect(searchElement.classList).toContain('ant-input-group-wrapper');
  });

  it('should be apply size classes', () => {
    const searchElement: HTMLElement = fixture.debugElement.query(By.directive(TriInputSearchDirective)).nativeElement;
    component.size.set('small');
    fixture.detectChanges();
    expect(searchElement.classList).toContain('ant-input-search-small');
    component.size.set('large');
    fixture.detectChanges();
    expect(searchElement.classList).toContain('ant-input-search-large');
  });

  it('should be apply button classes', async () => {
    const searchElement: HTMLElement = fixture.debugElement.query(By.directive(TriInputSearchDirective)).nativeElement;
    expect(searchElement.classList).not.toContain('ant-input-search-with-button');
    component.enterButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchElement.classList).toContain('ant-input-search-with-button');
    component.enterButton.set('submit');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchElement.classList).toContain('ant-input-search-with-button');
    component.enterButton.set('');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchElement.classList).toContain('ant-input-search-with-button');
  });

  it('should be input type = search', () => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.type).toEqual('search');
  });

  it('should be render search button', async () => {
    const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
    expect(searchButtonElement).toBeTruthy();
    expect(searchButtonElement.classList).toContain('ant-btn-default');
    component.enterButton.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchButtonElement.classList).toContain('ant-btn-primary');
    component.enterButton.set('');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchButtonElement.classList).toContain('ant-btn-primary');
  });

  it('should be render search icon when enterButton is an empty string', async () => {
    const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
    component.enterButton.set('');
    fixture.detectChanges();
    await fixture.whenStable();
    const searchIconElement = searchButtonElement.querySelector('.anticon-search');
    expect(searchIconElement).toBeTruthy();
  });

  it('should be apply size classes to search button', async () => {
    const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
    expect(searchButtonElement).toBeTruthy();
    component.size.set('small');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchButtonElement.classList).toContain('ant-btn-sm');
    component.size.set('large');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchButtonElement.classList).toContain('ant-btn-lg');
  });

  it('should be loading work', async () => {
    const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
    component.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(searchButtonElement.classList).toContain('ant-btn-loading');
  });

  describe('should be disabled work', () => {
    it('by input', async () => {
      const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
      component.enterButton.set('submit');
      fixture.detectChanges();
      await fixture.whenStable();
      expect(searchButtonElement.textContent.trim()).toEqual('submit');
    });

    it('by ng-content', async () => {
      const fixture = TestBed.createComponent(InputSearchCustomEnterButtonTestComponent);
      fixture.autoDetectChanges();
      const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
      await fixture.whenStable();
      expect(searchButtonElement.textContent.trim()).toEqual('custom');
    });
  });

  it('should be emit search event when click search button', async () => {
    vi.spyOn(component, 'onSearch');
    const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
    component.value.set('test');
    fixture.detectChanges();
    await fixture.whenStable();
    searchButtonElement.click();
    expect(component.onSearch).toHaveBeenCalledTimes(1);
    expect(component.onSearch).toHaveBeenCalledWith({ value: 'test', event: expect.any(Event), source: 'input' });
  });

  it('should be emit search event when keydown enter', async () => {
    vi.spyOn(component, 'onSearch');
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    component.value.set('test');
    fixture.detectChanges();
    await fixture.whenStable();
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(component.onSearch).toHaveBeenCalledTimes(1);
    expect(component.onSearch).toHaveBeenCalledWith({ value: 'test', event: expect.any(Event), source: 'input' });
  });

  it('should be emit search event when click clear button', async () => {
    vi.spyOn(component, 'onSearch');
    const clearButtonElement: HTMLElement = fixture.nativeElement.querySelector('.ant-input-clear-icon');
    component.value.set('test');
    fixture.detectChanges();
    await fixture.whenStable();
    clearButtonElement.click();
    expect(component.onSearch).toHaveBeenCalledTimes(1);
    expect(component.onSearch).toHaveBeenCalledWith({ value: '', event: expect.any(Event), source: 'clear' });
  });

  it('should not emit search event when loading', async () => {
    vi.spyOn(component, 'onSearch');
    const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.ant-input-search-button');
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const clearButtonElement: HTMLElement = fixture.nativeElement.querySelector('.ant-input-clear-icon');
    component.value.set('test');
    component.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    searchButtonElement.click();
    clearButtonElement.click();
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(component.onSearch).not.toHaveBeenCalled();
  });
});

@Component({
  imports: [TriInputModule, FormsModule],
  template: `
    <tri-input-search allowClear [loading]="loading()" [enterButton]="enterButton()" (search)="onSearch($event)">
      <input tri-input [(ngModel)]="value" [size]="size()" />
    </tri-input-search>
  `
})
class InputSearchTestComponent {
  readonly loading = signal(false);
  readonly enterButton = signal<boolean | string>(false);
  readonly value = signal('');
  readonly size = signal<TriSizeLDSType>('default');

  onSearch(_event: TriInputSearchEvent): void {}
}

@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-search>
      <input tri-input />
      <span inputSearchEnterButton>custom</span>
    </tri-input-search>
  `
})
class InputSearchCustomEnterButtonTestComponent {}
