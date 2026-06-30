/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TriFormModule } from 'ng-zorro-antd/form/form.module';

import { TriFormDirective, TriFormLayoutType } from './form.directive';
import { TriRequiredMark } from './types';

describe('form', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
  });

  describe('default', () => {
    let fixture: ComponentFixture<TriTestFormDirectiveComponent>;
    let testComponent: TriTestFormDirectiveComponent;
    let form: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFormDirectiveComponent);
      testComponent = fixture.componentInstance;
      form = fixture.debugElement.query(By.directive(TriFormDirective));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(form.nativeElement.classList).toContain('ant-form');
      expect(form.nativeElement.classList).toContain('ant-form-horizontal');
    });

    it('should layout work', () => {
      testComponent.layout.set('vertical');

      fixture.detectChanges();

      expect(form.nativeElement.classList).toContain('ant-form-vertical');
      expect(form.nativeElement.classList).not.toContain('ant-form-horizontal');

      testComponent.layout.set('inline');

      fixture.detectChanges();

      expect(form.nativeElement.classList).not.toContain('ant-form-vertical');
      expect(form.nativeElement.classList).not.toContain('ant-form-horizontal');
      expect(form.nativeElement.classList).toContain('ant-form-inline');
    });
  });

  describe('label integrate', () => {
    let fixture: ComponentFixture<TriTestFormLabelIntegrateComponent>;
    let testComponent: TriTestFormLabelIntegrateComponent;
    let form: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFormLabelIntegrateComponent);
      testComponent = fixture.componentInstance;
      form = fixture.debugElement.query(By.directive(TriFormDirective));
    });

    afterEach(() => {
      testComponent.defaultNoColon.set(false);
      testComponent.noColon.set(false);
      testComponent.testPriority.set(false);
    });

    it('should set default `NoColon` value', () => {
      const labels = (form.nativeElement as HTMLElement).querySelectorAll<HTMLLabelElement>(
        '.ant-form-item-label label'
      );
      labels.forEach(label => expect(label.classList).not.toContain('ant-form-item-no-colon'));

      testComponent.defaultNoColon.set(true);

      fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
    });

    it('should label have high priority', () => {
      const labels = (form.nativeElement as HTMLElement).querySelectorAll<HTMLLabelElement>(
        '.ant-form-item-label label'
      );
      labels.forEach(label => expect(label.classList).not.toContain('ant-form-item-no-colon'));

      testComponent.defaultNoColon.set(true);

      fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
      testComponent.testPriority.set(true);

      fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
      labels.forEach(label => {
        if (label.innerText === 'TEST_PRIORITY') {
          expect(label.classList).not.toContain('ant-form-item-no-colon');
        } else {
          expect(label.classList).toContain('ant-form-item-no-colon');
        }
      });

      testComponent.defaultNoColon.set(false);
      testComponent.noColon.set(true);

      fixture.detectChanges();

      labels.forEach(label => {
        if (label.innerText === 'TEST_PRIORITY') {
          expect(label.classList).toContain('ant-form-item-no-colon');
        } else {
          expect(label.classList).not.toContain('ant-form-item-no-colon');
        }
      });
    });
  });

  describe('required mark', () => {
    let fixture: ComponentFixture<TriTestFormRequiredMarkComponent>;
    let testComponent: TriTestFormRequiredMarkComponent;
    let form: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestFormRequiredMarkComponent);
      testComponent = fixture.componentInstance;
      form = fixture.debugElement.query(By.directive(TriFormDirective));
      fixture.detectChanges();
    });

    it('should handle boolean required mark (default: true)', () => {
      const requiredLabel = form.nativeElement.querySelector('.required-label label');
      const optionalLabel = form.nativeElement.querySelector('.optional-label label');

      expect(requiredLabel.classList).toContain('ant-form-item-required');
      expect(requiredLabel.classList).not.toContain('ant-form-item-required-mark-optional');
      expect(optionalLabel.classList).not.toContain('ant-form-item-required');
    });

    it('should handle boolean required mark (false)', () => {
      testComponent.requiredMark.set(false);
      fixture.detectChanges();

      const requiredLabel = form.nativeElement.querySelector('.required-label label');
      const optionalLabel = form.nativeElement.querySelector('.optional-label label');

      expect(requiredLabel.classList).toContain('ant-form-item-required');
      expect(requiredLabel.classList).toContain('ant-form-item-required-mark-hidden');
      expect(optionalLabel.classList).not.toContain('ant-form-item-required');
      expect(optionalLabel.classList).toContain('ant-form-item-required-mark-hidden');
    });

    it('should handle optional required mark', () => {
      testComponent.requiredMark.set('optional');
      fixture.detectChanges();

      const requiredLabel = form.nativeElement.querySelector('.required-label label');
      const optionalLabel = form.nativeElement.querySelector('.optional-label label');

      expect(requiredLabel.classList).toContain('ant-form-item-required');
      expect(requiredLabel.classList).toContain('ant-form-item-required-mark-optional');
      expect(optionalLabel.classList).not.toContain('ant-form-item-required');
    });

    it('should handle custom template required mark', () => {
      testComponent.useCustomTemplate.set(true);
      fixture.detectChanges();

      const requiredLabel = form.nativeElement.querySelector('.required-label');
      const optionalLabel = form.nativeElement.querySelector('.optional-label');

      expect(requiredLabel.querySelector('.custom-required')).toBeTruthy();
      expect(requiredLabel.querySelector('.custom-required').textContent?.trim()).toBe('REQUIRED');
      expect(optionalLabel.querySelector('.custom-optional')).toBeTruthy();
      expect(optionalLabel.querySelector('.custom-optional').textContent?.trim()).toBe('OPTIONAL');
    });

    it('should propagate required mark from form directive to labels', () => {
      const formDirective = form.injector.get(TriFormDirective);
      expect(formDirective.requiredMark()).toBe(true);

      testComponent.requiredMark.set('optional');
      fixture.detectChanges();

      expect(formDirective.requiredMark()).toBe('optional');
    });

    it('should handle template context correctly', () => {
      testComponent.useCustomTemplate.set(true);
      fixture.detectChanges();

      const customTemplateElement = form.nativeElement.querySelector('.custom-required');
      expect(customTemplateElement).toBeTruthy();

      const labelContent = form.nativeElement.querySelector('.required-label .label-content');
      expect(labelContent).toBeTruthy();
      expect(labelContent.textContent?.trim()).toBe('Required Field');
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `<form tri-form [layout]="layout()"></form>`
})
export class TriTestFormDirectiveComponent {
  readonly layout = signal<TriFormLayoutType>('horizontal');
}

@Component({
  imports: [TriFormModule],
  template: `
    <form tri-form [noColon]="defaultNoColon()">
      <tri-form-item>
        <tri-form-label>Label</tri-form-label>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Label</tri-form-label>
      </tri-form-item>
      @if (testPriority()) {
        <tri-form-item>
          <tri-form-label [noColon]="noColon()">TEST_PRIORITY</tri-form-label>
        </tri-form-item>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestFormLabelIntegrateComponent {
  readonly defaultNoColon = signal(false);
  readonly testPriority = signal(false);
  readonly noColon = signal(false);
}

@Component({
  imports: [TriFormModule, NgTemplateOutlet],
  template: `
    <form tri-form [requiredMark]="useCustomTemplate() ? customRequiredMarkTemplate : requiredMark()">
      <tri-form-item class="required-label">
        <tri-form-label required>
          <span class="label-content">Required Field</span>
        </tri-form-label>
      </tri-form-item>
      <tri-form-item class="optional-label">
        <tri-form-label>
          <span class="label-content">Optional Field</span>
        </tri-form-label>
      </tri-form-item>
    </form>

    <ng-template #customRequiredMarkTemplate let-label let-required="required">
      @if (required) {
        <span class="custom-required">REQUIRED</span>
      } @else {
        <span class="custom-optional">OPTIONAL</span>
      }
      <ng-container *ngTemplateOutlet="label" />
    </ng-template>
  `
})
export class TriTestFormLabelIntegrateComponent {
  readonly defaultNoColon = signal(false);
  readonly testPriority = signal(false);
  readonly noColon = signal(false);
}

@Component({
  imports: [TriFormModule, NgTemplateOutlet],
  template: `
    <form tri-form [requiredMark]="useCustomTemplate() ? customRequiredMarkTemplate : requiredMark()">
      <tri-form-item class="required-label">
        <tri-form-label required>
          <span class="label-content">Required Field</span>
        </tri-form-label>
      </tri-form-item>
      <tri-form-item class="optional-label">
        <tri-form-label>
          <span class="label-content">Optional Field</span>
        </tri-form-label>
      </tri-form-item>
    </form>

    <ng-template #customRequiredMarkTemplate let-label let-required="required">
      @if (required) {
        <span class="custom-required">REQUIRED</span>
      } @else {
        <span class="custom-optional">OPTIONAL</span>
      }
      <ng-container *ngTemplateOutlet="label" />
    </ng-template>
  `
})
export class TriTestFormRequiredMarkComponent {
  readonly requiredMark = signal<TriRequiredMark>(true);
  readonly useCustomTemplate = signal(false);
}
