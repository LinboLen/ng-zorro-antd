/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { dispatchFakeEvent } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType, TriStatus } from 'ng-zorro-antd/core/types';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFormControlStatusType, TriFormModule } from '../form';
import { TriInputNumberGroupComponent } from './input-number-group.component';
import { TriInputNumberLegacyModule } from './input-number.module';

describe('input-number-group', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  }));

  describe('input number group', () => {
    describe('addon', () => {
      let testComponent: TriTestInputNumberGroupAddonComponent;
      let fixture: ComponentFixture<TriTestInputNumberGroupAddonComponent>;
      let inputNumberGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupAddonComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent)).nativeElement;
      });

      it('should not show addon without before and after content', () => {
        expect(inputNumberGroupElement.firstElementChild!.classList).not.toContain('ant-input-number-group');
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number');
      });

      it('should before content string work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-group');
        expect(inputNumberGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputNumberGroupElement.firstElementChild!.lastElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.firstElementChild!.firstElementChild as HTMLElement).innerText).toBe('before');
      });

      it('should before content template work', () => {
        testComponent.beforeContent = testComponent.beforeTemplate;
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-group');
        expect(inputNumberGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputNumberGroupElement.firstElementChild!.lastElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.firstElementChild!.firstElementChild as HTMLElement).innerText).toBe(
          'beforeTemplate'
        );
      });

      it('should after content string work', () => {
        testComponent.afterContent = 'after';
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-group');
        expect(inputNumberGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputNumberGroupElement.firstElementChild!.firstElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.firstElementChild!.lastElementChild as HTMLElement).innerText).toBe('after');
      });

      it('should after content template work', () => {
        testComponent.afterContent = testComponent.afterTemplate;
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-group');
        expect(inputNumberGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputNumberGroupElement.firstElementChild!.firstElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.firstElementChild!.lastElementChild as HTMLElement).innerText).toBe(
          'afterTemplate'
        );
      });

      it('should size work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-group-wrapper');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-group-wrapper-lg');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-group-wrapper-sm');
      });
    });

    describe('affix', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupAffixComponent>;
      let testComponent: TriTestInputNumberGroupAffixComponent;
      let inputNumberGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupAffixComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent)).nativeElement;
      });

      it('should not show addon without before and after content', () => {
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number');
      });

      it('should before content string work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-prefix');
        expect(inputNumberGroupElement.children.length).toBe(2);
        expect(inputNumberGroupElement.lastElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.firstElementChild as HTMLElement).innerText).toBe('before');
      });

      it('should before content template work', () => {
        testComponent.beforeContent = testComponent.beforeTemplate;
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-prefix');
        expect(inputNumberGroupElement.children.length).toBe(2);
        expect(inputNumberGroupElement.lastElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.firstElementChild as HTMLElement).innerText).toBe('beforeTemplate');
      });

      it('should after content string work', () => {
        testComponent.afterContent = 'after';
        fixture.detectChanges();
        expect(inputNumberGroupElement.lastElementChild!.classList).toContain('ant-input-number-suffix');
        expect(inputNumberGroupElement.children.length).toBe(2);
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.lastElementChild as HTMLElement).innerText).toBe('after');
      });

      it('should after content template work', () => {
        testComponent.afterContent = testComponent.afterTemplate;
        fixture.detectChanges();
        expect(inputNumberGroupElement.lastElementChild!.classList).toContain('ant-input-number-suffix');
        expect(inputNumberGroupElement.children.length).toBe(2);
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number');
        expect((inputNumberGroupElement.lastElementChild as HTMLElement).innerText).toBe('afterTemplate');
      });

      it('should size work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-affix-wrapper');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-affix-wrapper-lg');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-affix-wrapper-sm');
      });

      it('should disabled work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).not.toContain('ant-input-number-affix-wrapper-disabled');
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-affix-wrapper-disabled');
      });

      it('should focus work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).not.toContain('ant-input-number-affix-wrapper-focused');
        dispatchFakeEvent(inputNumberGroupElement, 'focus');
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-affix-wrapper-focused');
      });
    });

    describe('multiple', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupMultipleComponent>;
      let testComponent: TriTestInputNumberGroupMultipleComponent;
      let inputNumberGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupMultipleComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent)).nativeElement;
      });

      it('should size work', () => {
        expect(inputNumberGroupElement.firstElementChild!.classList).not.toContain('ant-input-number-lg');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-lg');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputNumberGroupElement.firstElementChild!.classList).toContain('ant-input-number-sm');
      });
    });

    describe('col', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupColComponent>;
      let inputNumberGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupColComponent);
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent)).nativeElement;
      });

      it('should size work', () => {
        expect(inputNumberGroupElement.querySelector('nz-input-number')!.classList).toContain('ant-input-number-lg');
      });
    });

    describe('mix', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupMixComponent>;
      let inputGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupMixComponent);
        fixture.detectChanges();
        inputGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent)).nativeElement;
      });

      it('should mix work', () => {
        expect(
          inputGroupElement.querySelector('.ant-input-number-affix-wrapper')!.nextElementSibling!.classList
        ).toContain('ant-input-number-group-addon');
      });
    });

    describe('status', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupWithStatusComponent>;
      let inputNumberGroupElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupWithStatusComponent);
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent));
      });

      it('should className correct with prefix', () => {
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.classList).toContain(
          'ant-input-number-affix-wrapper-status-error'
        );

        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.className).toContain(
          'ant-input-number-affix-wrapper-status-warning'
        );

        fixture.componentInstance.status = '';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.className).not.toContain(
          'ant-input-number-affix-wrapper-status-warning'
        );
      });

      it('should className correct with addon', () => {
        fixture.componentInstance.isAddon = true;
        fixture.detectChanges();
        // re-query input element
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent));
        expect(inputNumberGroupElement.nativeElement.classList).toContain(
          'ant-input-number-group-wrapper-status-error'
        );

        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.className).toContain(
          'ant-input-number-group-wrapper-status-warning'
        );

        fixture.componentInstance.status = '';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.className).not.toContain(
          'ant-input-number-group-wrapper-status-warning'
        );
      });
    });

    describe('dir', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupWithDirComponent>;
      let inputNumberGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupWithDirComponent);
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent)).nativeElement;
      });

      it('should dir work', () => {
        expect(inputNumberGroupElement.classList).not.toContain('ant-input-number-group-wrapper-rtl');
        fixture.componentInstance.dir = 'rtl';
        fixture.detectChanges();
        expect(inputNumberGroupElement.classList).toContain('ant-input-number-group-wrapper-rtl');
      });
    });

    describe('in form', () => {
      let fixture: ComponentFixture<TriTestInputNumberGroupInFormComponent>;
      let inputNumberGroupElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputNumberGroupInFormComponent);
        fixture.detectChanges();
        inputNumberGroupElement = fixture.debugElement.query(By.directive(TriInputNumberGroupComponent));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.classList).toContain(
          'ant-input-number-affix-wrapper-status-error'
        );
        expect(inputNumberGroupElement.nativeElement.querySelector('nz-form-item-feedback-icon')).toBeTruthy();

        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.classList).toContain(
          'ant-input-number-affix-wrapper-status-warning'
        );

        fixture.componentInstance.status = 'success';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.classList).toContain(
          'ant-input-number-affix-wrapper-status-success'
        );

        fixture.componentInstance.feedback = false;
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.querySelector('nz-form-item-feedback-icon')).toBeNull();
      });

      it('should className correct with addon', () => {
        fixture.componentInstance.addon = 'before';
        fixture.detectChanges();
        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputNumberGroupElement.nativeElement.classList).toContain(
          'ant-input-number-group-wrapper-status-warning'
        );
        expect(inputNumberGroupElement.nativeElement.classList).not.toContain(
          'ant-input-number-affix-wrapper-status-warning'
        );
      });
    });
  });
});

@Component({
  imports: [TriInputNumberLegacyModule],
  template: `
    <tri-input-number-group [addOnBefore]="beforeContent" [addOnAfter]="afterContent" [size]="size">
      <tri-input-number></tri-input-number>
    </tri-input-number-group>
    <ng-template #beforeTemplate>beforeTemplate</ng-template>
    <ng-template #afterTemplate>afterTemplate</ng-template>
  `
})
export class TriTestInputNumberGroupAddonComponent {
  @ViewChild('beforeTemplate', { static: false }) beforeTemplate!: TemplateRef<void>;
  @ViewChild('afterTemplate', { static: false }) afterTemplate!: TemplateRef<void>;
  beforeContent?: string | TemplateRef<void>;
  afterContent?: string | TemplateRef<void>;
  size: TriSizeLDSType = 'default';
}

@Component({
  imports: [TriInputNumberLegacyModule],
  template: `
    <tri-input-number-group [prefix]="beforeContent" [suffix]="afterContent" [size]="size">
      <tri-input-number [disabled]="disabled"></tri-input-number>
    </tri-input-number-group>
    <ng-template #beforeTemplate>beforeTemplate</ng-template>
    <ng-template #afterTemplate>afterTemplate</ng-template>
  `
})
export class TriTestInputNumberGroupAffixComponent {
  @ViewChild('beforeTemplate', { static: false }) beforeTemplate!: TemplateRef<void>;
  @ViewChild('afterTemplate', { static: false }) afterTemplate!: TemplateRef<void>;
  beforeContent?: string | TemplateRef<void>;
  afterContent?: string | TemplateRef<void>;
  size: TriSizeLDSType = 'default';
  disabled = false;
}

@Component({
  imports: [TriInputNumberLegacyModule],
  template: `
    <tri-input-number-group [size]="size">
      <tri-input-number></tri-input-number>
      <tri-input-number></tri-input-number>
    </tri-input-number-group>
  `
})
export class TriTestInputNumberGroupMultipleComponent {
  size: TriSizeLDSType = 'default';
}

@Component({
  imports: [FormsModule, TriGridModule, TriInputNumberLegacyModule],
  template: `
    <tri-input-number-group tri-row size="large">
      <div tri-col span="8">
        <tri-input-number [ngModel]="1234" [step]="1"></tri-input-number>
      </div>
      <div tri-col span="8">
        <tri-input-number [ngModel]="5678" [step]="1"></tri-input-number>
      </div>
    </tri-input-number-group>
  `
})
export class TriTestInputNumberGroupColComponent {}

@Component({
  imports: [TriInputNumberLegacyModule],
  template: `
    <tri-input-number-group prefixIcon="user" addOnAfter="@example.com">
      <tri-input-number></tri-input-number>
    </tri-input-number-group>
  `
})
export class TriTestInputNumberGroupMixComponent {}

@Component({
  imports: [TriIconModule, TriInputNumberLegacyModule],
  template: `
    @if (!isAddon) {
      <tri-input-number-group [prefix]="prefixTemplateClock" [status]="status">
        <tri-input-number />
      </tri-input-number-group>
      <ng-template #prefixTemplateClock>
        <tri-icon type="clock-circle" theme="outline" />
      </ng-template>
    } @else {
      <tri-input-number-group addOnAfterIcon="setting" [status]="status">
        <tri-input-number />
      </tri-input-number-group>
    }
  `
})
export class TriTestInputNumberGroupWithStatusComponent {
  isAddon = false;
  status: TriStatus = 'error';
}

@Component({
  imports: [BidiModule, TriInputNumberLegacyModule],
  template: `
    <div [dir]="dir">
      <tri-input-number-group addOnAfterIcon="setting">
        <tri-input-number></tri-input-number>
      </tri-input-number-group>
    </div>
  `
})
export class TriTestInputNumberGroupWithDirComponent {
  dir: Direction = 'ltr';
}

@Component({
  imports: [TriFormModule, TriInputNumberLegacyModule],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-control [hasFeedback]="feedback" [validateStatus]="status">
          <tri-input-number-group [addOnBefore]="addon">
            <tri-input-number></tri-input-number>
          </tri-input-number-group>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriTestInputNumberGroupInFormComponent {
  status: TriFormControlStatusType = 'error';
  feedback = true;
  addon: string = '';
}
