/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { dispatchFakeEvent, updateNonSignalsInput } from 'ng-zorro-antd/core/testing';
import { TriInputModule } from 'ng-zorro-antd/input/input.module';
import { TriTextareaCountComponent } from 'ng-zorro-antd/input/textarea-count.component';

describe('textarea-count', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

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

    it('should count update work', async () => {
      testComponent.inputValue.set('test');
      fixture.detectChanges();
      await updateNonSignalsInput(fixture);

      expect(textareaCountElement.getAttribute('data-count')).toBe('4');
    });
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

    it('should count update with max length work', async () => {
      testComponent.inputValue.set('test');
      fixture.detectChanges();
      await updateNonSignalsInput(fixture);

      expect(textareaCountElement.getAttribute('data-count')).toBe('4/100');
    });
  });

  describe('with Signal Forms', () => {
    it('should update the count when the field value changes', async () => {
      const fixture = TestBed.createComponent(TriTestInputTextareaCountWithSignalFormComponent);
      fixture.autoDetectChanges();
      await fixture.whenStable();

      const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
      const textareaCountElement = fixture.debugElement.query(By.directive(TriTextareaCountComponent)).nativeElement;
      textarea.value = 'Signal Forms';
      dispatchFakeEvent(textarea, 'input');
      await fixture.whenStable();

      expect(textareaCountElement.getAttribute('data-count')).toBe('12/50');
    });
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
  readonly inputValue = signal('');
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
  readonly inputValue = signal('');
}

@Component({
  imports: [FormField, TriInputModule],
  template: `
    <tri-textarea-count [maxCharacterCount]="50">
      <textarea rows="4" tri-input [formField]="form.bio"></textarea>
    </tri-textarea-count>
  `
})
export class TriTestInputTextareaCountWithSignalFormComponent {
  readonly model = signal({ bio: '' });
  readonly form = form(this.model);
}
