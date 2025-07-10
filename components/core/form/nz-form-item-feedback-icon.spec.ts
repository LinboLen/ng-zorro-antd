/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriValidateStatus } from 'ng-zorro-antd/core/types';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFormItemFeedbackIconComponent } from './nz-form-item-feedback-icon.component';

describe('nz-form-item-feedback-icon', () => {
  let fixture: ComponentFixture<TriFormItemFeedbackIconComponent>;
  let component: TriFormItemFeedbackIconComponent;
  let feedback: DebugElement;
  let firstChange = true;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations(), provideNzIconsTesting()]
    });
    fixture = TestBed.createComponent(TriFormItemFeedbackIconComponent);
    component = fixture.componentInstance;
    feedback = fixture.debugElement;
    fixture.detectChanges();
  });

  function changeStatus(status: TriValidateStatus): void {
    const previousStatus: TriValidateStatus = component.status;
    component.status = status;
    component.ngOnChanges({ status: new SimpleChange(previousStatus, status, firstChange) });
    firstChange = false;
    fixture.detectChanges();
  }

  it('should className correct', () => {
    changeStatus('');
    expect(fixture.nativeElement.classList).toContain('ant-form-item-feedback-icon');

    changeStatus('success');
    expect(fixture.nativeElement.classList).toContain('ant-form-item-feedback-icon-success');
    expect(fixture.nativeElement.querySelector('.anticon-check-circle-fill')).toBeTruthy();

    changeStatus('error');
    expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-error');
    expect(feedback.nativeElement.querySelector('.anticon-close-circle-fill')).toBeTruthy();

    changeStatus('warning');
    expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-warning');
    expect(feedback.nativeElement.querySelector('.anticon-exclamation-circle-fill')).toBeTruthy();

    changeStatus('validating');
    expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-validating');
    expect(feedback.nativeElement.querySelector('.anticon-loading')).toBeTruthy();
  });
});
