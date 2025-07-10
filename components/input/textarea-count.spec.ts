/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TriInputModule } from 'ng-zorro-antd/input/input.module';
import { TriTextareaCountComponent } from 'ng-zorro-antd/input/textarea-count.component';

describe('textarea-count', () => {
  describe('without-max-length', () => {
    let fixture: ComponentFixture<TriTestInputTextareaCountWithoutMaxComponent>;
    let testComponent: TriTestInputTextareaCountWithoutMaxComponent;
    let textareaCountElement: HTMLElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInputTextareaCountWithoutMaxComponent);
      testComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      textareaCountElement = fixture.debugElement.query(By.directive(TriTextareaCountComponent)).nativeElement;
    });
    it('should count work', () => {
      expect(textareaCountElement.getAttribute('data-count')).toBe('0');
    });
    it('should count update work', fakeAsync(() => {
      testComponent.inputValue = 'test';
      fixture.detectChanges();
      flush();

      expect(textareaCountElement.getAttribute('data-count')).toBe('4');
    }));
  });
  describe('with-max-length', () => {
    let fixture: ComponentFixture<TriTestInputTextareaCountWithMaxComponent>;
    let testComponent: TriTestInputTextareaCountWithMaxComponent;
    let textareaCountElement: HTMLElement;
    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInputTextareaCountWithMaxComponent);
      testComponent = fixture.debugElement.componentInstance;
      fixture.detectChanges();
      textareaCountElement = fixture.debugElement.query(By.directive(TriTextareaCountComponent)).nativeElement;
    });
    it('should count with max length work', () => {
      expect(textareaCountElement.getAttribute('data-count')).toBe('0/100');
    });
    it('should count update with max length work', fakeAsync(() => {
      testComponent.inputValue = 'test';
      fixture.detectChanges();
      flush();

      expect(textareaCountElement.getAttribute('data-count')).toBe('4/100');
    }));
  });
});

@Component({
  imports: [FormsModule, TriInputModule],
  template: `
    <tri-textarea-count>
      <textarea rows="4" tri-input [(ngModel)]="inputValue"></textarea>
    </tri-textarea-count>
  `
})
export class TriTestInputTextareaCountWithoutMaxComponent {
  inputValue = '';
}

@Component({
  imports: [FormsModule, TriInputModule],
  template: `
    <tri-textarea-count [maxCharacterCount]="100">
      <textarea rows="4" tri-input [(ngModel)]="inputValue"></textarea>
    </tri-textarea-count>
  `
})
export class TriTestInputTextareaCountWithMaxComponent {
  inputValue = '';
}
