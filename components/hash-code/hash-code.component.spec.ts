/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';

import { TriHashCodeComponent } from './hash-code.component';
import { TriHashCodeModule } from './hash-code.module';
import { TriModeType } from './typings';

describe('hash-code', () => {
  let fixture: ComponentFixture<TriTestHashCodeBasicComponent>;
  let testComponent: TriTestHashCodeBasicComponent;
  let resultEl: DebugElement;

  function waitingForTooltipToggling(): void {
    fixture.detectChanges();
    tick(500);
    fixture.detectChanges();
  }

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestHashCodeBasicComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriHashCodeComponent));
  });

  it('basic', () => {
    fixture.detectChanges();
    const dom = resultEl.nativeElement;
    expect(dom.querySelector('.ant-hash-code-header-title').innerText).toBe('HashCode');
    expect(dom.querySelectorAll('.ant-hash-code-code-value-block').length).toBe(8);
    expect(dom.querySelector('.ant-hash-code-header-logo').innerText).toBe('Antd');
    expect(!!dom.querySelector('.ant-hash-code-texaure')).toBeTrue();
  });

  it('should value length work', () => {
    testComponent.value =
      '683109f0f40ca72a15e05cc20931f8e6683109f0f40ca72a15e05cc20931f8e6683109f0f40ca72a15e05cc20931f8e6683109f0f40ca72a15e05cc20931f8e6';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelectorAll('.ant-hash-code-code-value-block').length).toBe(8);
    testComponent.value = '683109f0f40ca72a15e05cc20931f8e6';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelectorAll('.ant-hash-code-code-value-block').length).toBe(8);
    testComponent.value = '683109f0f40ca72a';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelectorAll('.ant-hash-code-code-value-block').length).toBe(4);
  });

  it('should mode single work', () => {
    testComponent.mode = 'single';
    fixture.detectChanges();
    expect(!!resultEl.nativeElement.querySelector('.ant-hash-code-header')).toBeFalse();
    expect(!!resultEl.nativeElement.querySelector('.ant-hash-code-header-copy')).toBeTrue();
    expect(resultEl.nativeElement.classList).toContain('ant-hash-code-single');
  });

  it('should mode strip work', () => {
    testComponent.mode = 'strip';
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-hash-code-strip');
  });

  it('should rect mode work', () => {
    testComponent.mode = 'rect';
    fixture.detectChanges();
    expect(!!resultEl.nativeElement.querySelector('.ant-hash-code-header')).toBeFalse();
    expect(!!resultEl.nativeElement.querySelector('.ant-hash-code-header-copy')).toBeTrue();
    expect(resultEl.nativeElement.classList).toContain('ant-hash-code-rect');
  });

  it('should type work', () => {
    testComponent.type = 'primary';
    fixture.detectChanges();
    expect(resultEl.nativeElement.classList).toContain('ant-hash-code-primary');
  });

  it('should copy work', fakeAsync(() => {
    fixture.detectChanges();
    const copy = resultEl.nativeElement.querySelector('.ant-hash-code-header-copy');
    dispatchMouseEvent(copy, 'click');
    waitingForTooltipToggling();
    expect(testComponent.copyValue).toBe(testComponent.value);
  }));
});

@Component({
  imports: [TriHashCodeModule],
  template: `
    <tri-hash-code
      [value]="value"
      [title]="title"
      [logo]="logo"
      [mode]="mode"
      [type]="type"
      (onCopy)="onCopy($event)"
    />
  `
})
export class TriTestHashCodeBasicComponent {
  value = 'dfb5fe9ef7b99b2b1db102114a6d7d445d992f40a5d575f801c148990199a068';
  title = 'HashCode';
  logo = 'Antd';
  mode: TriModeType = 'double';
  type: 'default' | 'primary' = 'default';
  copyValue = '';

  onCopy(value: string): void {
    this.copyValue = value;
  }
}
