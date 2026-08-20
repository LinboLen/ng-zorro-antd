/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriStatus } from 'ng-zorro-antd/core/types';
import { TriCronExpressionComponent } from 'ng-zorro-antd/cron-expression/cron-expression.component';
import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression/cron-expression.module';
import { TriCronExpressionSize } from 'ng-zorro-antd/cron-expression/typings';
import { TriFormControlStatusType, TriFormModule } from 'ng-zorro-antd/form';

describe('cron-expression', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

  describe('basic', () => {
    let fixture: ComponentFixture<TriTestCronExpressionComponent>;
    let testComponent: TriTestCronExpressionComponent;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCronExpressionComponent);
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriCronExpressionComponent));
    });

    it('should render basic cron-expression', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain('ant-input');
    });

    it('should nzSize work', () => {
      testComponent.size.set('small');
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-sm'
      );
      testComponent.size.set('large');
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-lg'
      );
    });

    it('should nzDisabled work', () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-disabled'
      );
    });

    it('should nzBorderless work', () => {
      testComponent.borderless.set(true);
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-borderless'
      );
    });

    it('should nzStatus work', () => {
      testComponent.status.set('error');
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-status-error'
      );

      testComponent.status.set('warning');
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-status-warning'
      );
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).not.toContain(
        'ant-input-status-error'
      );

      testComponent.status.set('');
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).not.toContain(
        'ant-input-status-warning'
      );
    });

    it('should use standard input focus class', () => {
      fixture.detectChanges();
      resultEl.componentInstance.focusEffect('minute');
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-focused'
      );

      resultEl.componentInstance.blurEffect();
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).not.toContain(
        'ant-input-focused'
      );
    });

    it('should nzCollapseDisable work', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('nz-cron-expression-preview')).not.toBeNull();
      testComponent.collapseDisable.set(true);
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('nz-cron-expression-preview')).toBeNull();
    });

    it('should nzExtra work', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-map')).not.toBeNull();
    });

    it('should nzSemantic work', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-preview-dateTime').innerText).toBe('Test');
    });
  });

  describe('type', () => {
    it('should nzType work', () => {
      const fixture = TestBed.createComponent(TriCronExpressionComponent);
      const element = fixture.debugElement.nativeElement;
      fixture.componentRef.setInput('nzType', 'spring');
      fixture.detectChanges();
      expect(element.querySelectorAll('nz-cron-expression-input').length).toBe(6);
      expect(element.querySelectorAll('nz-cron-expression-label').length).toBe(6);

      fixture.componentRef.setInput('nzType', 'linux');
      fixture.detectChanges();
      expect(element.querySelectorAll('nz-cron-expression-input').length).toBe(5);
      expect(element.querySelectorAll('nz-cron-expression-label').length).toBe(5);
    });
  });

  describe('form', () => {
    let fixture: ComponentFixture<TriTestCronExpressionFormComponent>;
    let testComponent: TriTestCronExpressionFormComponent;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCronExpressionFormComponent);
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriCronExpressionComponent));
    });

    it('should work with form', async () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).not.toContain(
        'ant-input-disabled'
      );
      testComponent.disable();
      await fixture.whenStable();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-disabled'
      );
    });

    it('should reflect parent FormControl validation status', () => {
      fixture.detectChanges();
      testComponent.formControl.markAsTouched();
      testComponent.formControl.setErrors({ external: true });
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-status-error'
      );

      testComponent.formControl.setErrors(null);
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).not.toContain(
        'ant-input-status-error'
      );
    });
  });

  describe('form status', () => {
    let fixture: ComponentFixture<TriTestCronExpressionStatusInFormComponent>;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCronExpressionStatusInFormComponent);
      resultEl = fixture.debugElement.query(By.directive(TriCronExpressionComponent));
    });

    it.each(['error', 'warning', 'success', 'validating'] as const)(
      'should reflect %s status from nz-form-control',
      status => {
        fixture.componentInstance.status.set(status);
        fixture.detectChanges();
        expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
          `ant-input-status-${status}`
        );
      }
    );

    it('should prioritize internal validation error', () => {
      fixture.componentInstance.status.set('warning');
      fixture.detectChanges();
      resultEl.componentInstance.getValue({ label: 'minute', value: 'invalid' });
      fixture.detectChanges();

      const classList = resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList;
      expect(classList).toContain('ant-input-status-error');
      expect(classList).not.toContain('ant-input-status-warning');
    });
  });
});

@Component({
  imports: [TriButtonModule, TriCronExpressionModule],
  template: `
    <tri-cron-expression
      [size]="size()"
      [collapseDisable]="collapseDisable()"
      [disabled]="disabled()"
      [borderless]="borderless()"
      [status]="status()"
      [extra]="shortcuts"
      [semantic]="semanticTemplate"
    />
    <ng-template #shortcuts>
      <button tri-button type="primary">Test</button>
    </ng-template>
    <ng-template #semanticTemplate>Test</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestCronExpressionComponent {
  readonly size = signal<TriCronExpressionSize>('default');
  readonly disabled = signal(false);
  readonly borderless = signal(false);
  readonly collapseDisable = signal(false);
  readonly status = signal<TriStatus>('');
}

@Component({
  imports: [ReactiveFormsModule, TriCronExpressionModule, TriFormModule],
  template: `
    <tri-form-control>
      <tri-cron-expression [formControl]="formControl" />
    </tri-form-control>
  `
})
export class TriTestCronExpressionComponent {
  readonly size = signal<TriCronExpressionSize>('default');
  readonly disabled = signal(false);
  readonly borderless = signal(false);
  readonly collapseDisable = signal(false);
  readonly status = signal<TriStatus>('');
}

@Component({
  imports: [ReactiveFormsModule, TriCronExpressionModule, TriFormModule],
  template: `
    <tri-form-control>
      <tri-cron-expression [formControl]="formControl" />
    </tri-form-control>
  `
})
export class TriTestCronExpressionFormComponent {
  formControl = new FormControl('1 1 1 * *');

  disable(): void {
    this.formControl.disable();
  }
}

@Component({
  imports: [TriCronExpressionModule, TriFormModule],
  template: `
    <tri-form-control [validateStatus]="status()">
      <tri-cron-expression />
    </tri-form-control>
  `
})
export class TriTestCronExpressionStatusInFormComponent {
  readonly status = signal<TriFormControlStatusType>('');
}
