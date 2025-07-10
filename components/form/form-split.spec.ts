/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TriFormModule } from 'ng-zorro-antd/form/form.module';

import { TriFormSplitComponent } from './form-split.component';

const testBedOptions = { imports: [NoopAnimationsModule] };

describe('nz-form-split', () => {
  describe('default', () => {
    let fixture: ComponentFixture<TriTestFormSplitComponent>;
    let split: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule(testBedOptions);
      fixture = TestBed.createComponent(TriTestFormSplitComponent);
      fixture.detectChanges();
      split = fixture.debugElement.query(By.directive(TriFormSplitComponent));
    });
    it('should className correct', () => {
      expect(split.nativeElement.classList).toContain('ant-form-split');
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `<tri-form-split></tri-form-split>`
})
export class TriTestFormSplitComponent {}
