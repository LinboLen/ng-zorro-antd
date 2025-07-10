/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TriFormItemComponent } from './form-item.component';
import { TriFormModule } from './form.module';

const testBedOptions = { imports: [NoopAnimationsModule] };

describe('nz-form-item', () => {
  describe('default', () => {
    let fixture: ComponentFixture<TriTestFormItemComponent>;
    let formItem: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule(testBedOptions);
      fixture = TestBed.createComponent(TriTestFormItemComponent);
      formItem = fixture.debugElement.query(By.directive(TriFormItemComponent));
    });
    it('should className correct', () => {
      expect(formItem.nativeElement.classList).toContain('ant-form-item');
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `<tri-form-item></tri-form-item>`
})
export class TriTestFormItemComponent {}
