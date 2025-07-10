/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DecimalPipe } from '@angular/common';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriStatisticValueType } from 'ng-zorro-antd/statistic/typings';

import { TriStatisticNumberComponent } from './statistic-number.component';
import { TriStatisticModule } from './statistic.module';

describe('nz-number', () => {
  let fixture: ComponentFixture<TriTestNumberComponent>;
  let testComponent: TriTestNumberComponent;
  let numberEl: DebugElement;

  describe('basic', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestNumberComponent);
      testComponent = fixture.componentInstance;
      numberEl = fixture.debugElement.query(By.directive(TriStatisticNumberComponent));
    });

    it('should have correct class', () => {
      fixture.detectChanges();
      expect(numberEl.nativeElement.firstElementChild!.classList.contains('ant-statistic-content-value')).toBeTruthy();
    });

    it('should render number', () => {
      // Int with group separator, decimal.
      testComponent.value = 12345.012;
      fixture.detectChanges();
      expect(numberEl.nativeElement.querySelector('.ant-statistic-content-value-int').innerText).toBe('12,345');
      expect(numberEl.nativeElement.querySelector('.ant-statistic-content-value-decimal').innerText).toBe('.012');
    });

    it('should support template', () => {
      testComponent.template = testComponent.tpl;
      testComponent.value = 12345.012;
      fixture.detectChanges();
      expect(numberEl.nativeElement.querySelector('.ant-statistic-content-value-int')).toBeFalsy();
      expect(numberEl.nativeElement.querySelector('.ant-statistic-content-value-decimal')).toBeFalsy();
      expect(numberEl.nativeElement.innerText).toBe("It's 12,345.012");
    });
  });
});

@Component({
  imports: [DecimalPipe, TriStatisticModule],
  template: `
    <tri-statistic-number [value]="(value | number)!" [valueTemplate]="template"></tri-statistic-number>
    <ng-template #tpl let-value>It's {{ value }}</ng-template>
  `
})
export class TriTestNumberComponent {
  @ViewChild('tpl', { static: true }) tpl?: TemplateRef<{ $implicit: TriStatisticValueType }>;

  value = 1;
  template?: TemplateRef<{ $implicit: TriStatisticValueType }>;
}
