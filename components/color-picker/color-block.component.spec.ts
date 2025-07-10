/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriColorBlockComponent, TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import { TriSizeLDSType } from 'ng-zorro-antd/core/types';

describe('nz-color-block', () => {
  let fixture: ComponentFixture<TriTestColorBlockComponent>;
  let component: TriTestColorBlockComponent;
  let resultEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TriTestColorBlockComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    resultEl = fixture.debugElement.query(By.directive(TriColorBlockComponent));
  });

  it('color-block basic', () => {
    fixture.detectChanges();
    const colorDom = resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner');
    expect(colorDom.style.backgroundColor).toBe('rgb(22, 119, 255)');
  });

  it('color-block color', () => {
    component.color = '#ff6600';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('.ant-color-picker-color-block-inner').style.backgroundColor).toBe(
      'rgb(255, 102, 0)'
    );
  });

  it('color-block size', () => {
    component.size = 'small';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('ng-antd-color-block').parentNode.classList).toContain(
      'ant-color-picker-inline-sm'
    );
    component.size = 'large';
    fixture.detectChanges();
    expect(resultEl.nativeElement.querySelector('ng-antd-color-block').parentNode.classList).toContain(
      'ant-color-picker-inline-lg'
    );
  });

  it('color-block click', () => {
    fixture.detectChanges();
    resultEl.nativeElement.querySelector('.ant-color-picker-color-block').click();
    expect(component.isClick).toBeTrue();
  });
});

@Component({
  imports: [TriColorPickerModule],
  template: `
    <tri-color-block [color]="color" [size]="size" (onClick)="clickHandle($event)"></tri-color-block>
  `
})
export class TriTestColorBlockComponent {
  color = '#1677ff';
  size: TriSizeLDSType = 'default';
  isClick: boolean = false;

  clickHandle(value: boolean): void {
    this.isClick = value;
  }
}
