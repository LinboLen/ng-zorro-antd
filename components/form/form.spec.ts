/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TriFormModule } from 'ng-zorro-antd/form/form.module';

import { TriFormDirective, TriFormLayoutType } from './form.directive';

const testBedOptions = {
  imports: [NoopAnimationsModule]
};

describe('nz-form', () => {
  describe('default', () => {
    let fixture: ComponentFixture<TriTestFormDirectiveComponent>;
    let testComponent: TriTestFormDirectiveComponent;
    let form: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule(testBedOptions);
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
      testComponent.layout = 'vertical';

      fixture.detectChanges();

      expect(form.nativeElement.classList).toContain('ant-form-vertical');
      expect(form.nativeElement.classList).not.toContain('ant-form-horizontal');

      testComponent.layout = 'inline';

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
      TestBed.configureTestingModule(testBedOptions);
      fixture = TestBed.createComponent(TriTestFormLabelIntegrateComponent);
      testComponent = fixture.componentInstance;
      form = fixture.debugElement.query(By.directive(TriFormDirective));
    });

    afterEach(() => {
      testComponent.defaultNoColon = false;
      testComponent.noColon = false;
      testComponent.testPriority = false;
    });

    it('should set default `NoColon` value', () => {
      const labels = (form.nativeElement as HTMLElement).querySelectorAll<HTMLLabelElement>(
        '.ant-form-item-label label'
      );
      labels.forEach(label => expect(label.classList).not.toContain('ant-form-item-no-colon'));

      testComponent.defaultNoColon = true;

      fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
    });

    it('should label have high priority', () => {
      const labels = (form.nativeElement as HTMLElement).querySelectorAll<HTMLLabelElement>(
        '.ant-form-item-label label'
      );
      labels.forEach(label => expect(label.classList).not.toContain('ant-form-item-no-colon'));

      testComponent.defaultNoColon = true;

      fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
      testComponent.testPriority = true;

      fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
      labels.forEach(label => {
        if (label.innerText === 'TEST_PRIORITY') {
          expect(label.classList).not.toContain('ant-form-item-no-colon');
        } else {
          expect(label.classList).toContain('ant-form-item-no-colon');
        }
      });

      testComponent.defaultNoColon = false;
      testComponent.noColon = true;

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
});

@Component({
  imports: [TriFormModule],
  template: `<form tri-form [layout]="layout"></form>`
})
export class TriTestFormDirectiveComponent {
  layout: TriFormLayoutType = 'horizontal';
}

@Component({
  imports: [TriFormModule],
  template: `
    <form tri-form [noColon]="defaultNoColon">
      <tri-form-item>
        <tri-form-label>Label</tri-form-label>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Label</tri-form-label>
      </tri-form-item>
      @if (testPriority) {
        <tri-form-item>
          <tri-form-label [noColon]="noColon">TEST_PRIORITY</tri-form-label>
        </tri-form-item>
      }
    </form>
  `
})
export class TriTestFormLabelIntegrateComponent {
  defaultNoColon = false;
  testPriority = false;
  noColon = false;
}
