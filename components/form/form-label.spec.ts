/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TriLabelAlignType } from 'ng-zorro-antd/form/form.directive';
import { TriFormModule } from 'ng-zorro-antd/form/form.module';

import { TriFormLabelComponent, TriFormTooltipIcon } from './form-label.component';

const testBedOptions = { imports: [NoopAnimationsModule] };

describe('nz-form-label', () => {
  describe('default', () => {
    let fixture: ComponentFixture<TriTestFormLabelComponent>;
    let testComponent: TriTestFormLabelComponent;
    let label: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule(testBedOptions);
      fixture = TestBed.createComponent(TriTestFormLabelComponent);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();
      label = fixture.debugElement.query(By.directive(TriFormLabelComponent));
    });
    it('should className correct', () => {
      expect(label.nativeElement.classList).toContain('ant-form-item-label');
    });
    it('should label for work', () => {
      expect(label.nativeElement.querySelector('label').attributes.getNamedItem('for').value).toBe('test');
    });
    it('should required work', () => {
      expect(label.nativeElement.querySelector('label').classList).not.toContain('ant-form-item-required');

      testComponent.required = true;

      fixture.detectChanges();

      expect(label.nativeElement.querySelector('label').classList).toContain('ant-form-item-required');
    });

    it('should no colon work', () => {
      expect(label.nativeElement.querySelector('label').classList).not.toContain('ant-form-item-no-colon');

      testComponent.noColon = true;

      fixture.detectChanges();

      expect(label.nativeElement.querySelector('label').classList).toContain('ant-form-item-no-colon');
    });

    it('should tooltip work', () => {
      expect(label.nativeElement.querySelector('.ant-form-item-tooltip')).toBeNull();

      testComponent.tooltipTitle = 'tooltip';
      fixture.detectChanges();

      expect(label.nativeElement.querySelector('.ant-form-item-tooltip')).toBeDefined();
      expect(label.nativeElement.querySelector('.anticon-question-circle')).toBeDefined();

      testComponent.tooltipIcon = 'info-circle';
      fixture.detectChanges();

      expect(label.nativeElement.querySelector('.ant-form-item-tooltip')).toBeDefined();
      expect(label.nativeElement.querySelector('.anticon-info-circle')).toBeDefined();
    });
    it('should label align work', () => {
      expect(label.nativeElement.classList).not.toContain('ant-form-item-label-left');

      testComponent.align = 'left';

      fixture.detectChanges();

      expect(label.nativeElement.classList).toContain('ant-form-item-label-left');
    });

    it('should label wrap work', () => {
      expect(label.nativeElement.classList).not.toContain('ant-form-item-label-wrap');

      testComponent.labelWrap = true;
      fixture.detectChanges();

      expect(label.nativeElement.classList).toContain('ant-form-item-label-wrap');
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `
    <tri-form-label
      [for]="forValue"
      [noColon]="noColon"
      [required]="required"
      [tooltipTitle]="tooltipTitle"
      [tooltipIcon]="tooltipIcon"
      [labelAlign]="align"
      [labelWrap]="labelWrap"
    ></tri-form-label>
  `
})
export class TriTestFormLabelComponent {
  forValue = 'test';
  required = false;
  noColon = false;
  tooltipTitle?: string;
  tooltipIcon!: string | TriFormTooltipIcon;
  align: TriLabelAlignType = 'right';
  labelWrap = false;
}
