/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCronExpressionComponent } from 'ng-zorro-antd/cron-expression/cron-expression.component';
import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression/cron-expression.module';
import { TriCronExpressionSize } from 'ng-zorro-antd/cron-expression/typings';

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
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriCronExpressionComponent));
    });

    it('cron-expression basic', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain('ant-input');
    });

    it('cron-expression nzSize', () => {
      testComponent.size = 'small';
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-sm'
      );
      testComponent.size = 'large';
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-lg'
      );
    });

    it('cron-expression nzDisabled', () => {
      testComponent.disabled = true;
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-disabled'
      );
    });

    it('cron-expression nzBorderless', () => {
      testComponent.borderless = true;
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-borderless'
      );
    });

    it('cron-expression nzCollapseDisable', () => {
      expect(resultEl.nativeElement.querySelector('nz-cron-expression-preview')).not.toBe(null);
      testComponent.collapseDisable = true;
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('nz-cron-expression-preview')).toBe(null);
    });

    it('cron-expression nzExtra', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-map')).not.toBe(null);
    });

    it('cron-expression nzSemantic', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-preview-dateTime').innerText).toBe('Test');
    });
  });

  describe('type', () => {
    let fixture: ComponentFixture<TriTestCronExpressionTypeComponent>;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCronExpressionTypeComponent);
      fixture.detectChanges();
      resultEl = fixture.debugElement.query(By.directive(TriCronExpressionComponent));
    });

    it('cron-expression type', () => {
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelectorAll('nz-cron-expression-input').length).toBe(6);
      expect(resultEl.nativeElement.querySelectorAll('nz-cron-expression-label').length).toBe(6);

      fixture.componentRef.instance.type = 'linux';
      fixture.detectChanges();
      expect(resultEl.nativeElement.querySelectorAll('nz-cron-expression-input').length).toBe(5);
      expect(resultEl.nativeElement.querySelectorAll('nz-cron-expression-label').length).toBe(5);
    });
  });

  describe('form', () => {
    let fixture: ComponentFixture<TriTestCronExpressionFormComponent>;
    let testComponent: TriTestCronExpressionFormComponent;
    let resultEl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCronExpressionFormComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      resultEl = fixture.debugElement.query(By.directive(TriCronExpressionComponent));
    });

    it('cron-expression form', fakeAsync(() => {
      flush();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).not.toContain(
        'ant-input-disabled'
      );
      testComponent.disable();
      fixture.detectChanges();
      flush();
      expect(resultEl.nativeElement.querySelector('.ant-cron-expression-input-group').classList).toContain(
        'ant-input-disabled'
      );
    }));
  });
});

@Component({
  imports: [TriButtonModule, TriCronExpressionModule],
  template: `
    <tri-cron-expression
      [size]="size"
      [collapseDisable]="collapseDisable"
      [disabled]="disabled"
      [borderless]="borderless"
      [extra]="shortcuts"
      [semantic]="semanticTemplate"
    ></tri-cron-expression>
    <ng-template #shortcuts>
      <button tri-button type="primary">Test</button>
    </ng-template>
    <ng-template #semanticTemplate>Test</ng-template>
  `
})
export class TriTestCronExpressionComponent {
  size: TriCronExpressionSize = 'default';
  disabled = false;
  borderless = false;
  collapseDisable = false;
}

@Component({
  imports: [TriCronExpressionModule],
  template: `<tri-cron-expression [type]="type"></tri-cron-expression>`
})
export class TriTestCronExpressionTypeComponent {
  type: 'linux' | 'spring' = 'spring';
}

@Component({
  imports: [ReactiveFormsModule, TriCronExpressionModule],
  template: `<tri-cron-expression [formControl]="formControl"></tri-cron-expression>`
})
export class TriTestCronExpressionFormComponent {
  formControl = new FormControl('1 1 1 * *');

  disable(): void {
    this.formControl.disable();
  }
}
