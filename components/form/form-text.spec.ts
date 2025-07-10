/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TriFormModule } from 'ng-zorro-antd/form/form.module';

import { TriFormTextComponent } from './form-text.component';

const testBedOptions = { imports: [NoopAnimationsModule] };

describe('nz-form-text', () => {
  describe('default', () => {
    let fixture: ComponentFixture<TriTestFormTextComponent>;
    let text: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule(testBedOptions);
      fixture = TestBed.createComponent(TriTestFormTextComponent);
      fixture.detectChanges();
      text = fixture.debugElement.query(By.directive(TriFormTextComponent));
    });
    it('should className correct', () => {
      expect(text.nativeElement.classList).toContain('ant-form-text');
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `<tri-form-text></tri-form-text>`
})
export class TriTestFormTextComponent {}
