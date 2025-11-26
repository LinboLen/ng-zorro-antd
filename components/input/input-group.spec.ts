/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { dispatchFakeEvent } from 'ng-zorro-antd/core/testing';
import { TriSizeLDSType, TriStatus } from 'ng-zorro-antd/core/types';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriFormControlStatusType, TriFormModule } from '../form';
import { TriInputGroupComponent } from './input-group.component';
import { TriInputModule } from './input.module';

describe('input-group', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideZoneChangeDetection()]
    });
  });

  describe('input group', () => {
    describe('addon', () => {
      let testComponent: TriTestInputGroupAddonComponent;
      let fixture: ComponentFixture<TriTestInputGroupAddonComponent>;
      let inputGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputGroupAddonComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputGroupElement = fixture.debugElement.query(By.directive(TriInputGroupComponent)).nativeElement;
      });

      it('should not show addon without before and after content', () => {
        expect(inputGroupElement.firstElementChild!.classList).not.toContain('ant-input-group');
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input');
      });

      it('should before content string work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input-group');
        expect(inputGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputGroupElement.firstElementChild!.lastElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.firstElementChild!.firstElementChild as HTMLElement).innerText).toBe('before');
      });

      it('should before content template work', () => {
        testComponent.beforeContent = testComponent.beforeTemplate;
        fixture.detectChanges();
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input-group');
        expect(inputGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputGroupElement.firstElementChild!.lastElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.firstElementChild!.firstElementChild as HTMLElement).innerText).toBe(
          'beforeTemplate'
        );
      });

      it('should after content string work', () => {
        testComponent.afterContent = 'after';
        fixture.detectChanges();
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input-group');
        expect(inputGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputGroupElement.firstElementChild!.firstElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.firstElementChild!.lastElementChild as HTMLElement).innerText).toBe('after');
      });

      it('should after content template work', () => {
        testComponent.afterContent = testComponent.afterTemplate;
        fixture.detectChanges();
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input-group');
        expect(inputGroupElement.firstElementChild!.children.length).toBe(2);
        expect(inputGroupElement.firstElementChild!.firstElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.firstElementChild!.lastElementChild as HTMLElement).innerText).toBe('afterTemplate');
      });

      it('should size work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-group-wrapper');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-group-wrapper-lg');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-group-wrapper-sm');
      });
    });

    describe('affix', () => {
      let fixture: ComponentFixture<TriTestInputGroupAffixComponent>;
      let testComponent: TriTestInputGroupAffixComponent;
      let inputGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputGroupAffixComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputGroupElement = fixture.debugElement.query(By.directive(TriInputGroupComponent)).nativeElement;
      });

      it('should not show addon without before and after content', () => {
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input');
      });

      it('should before content string work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input-prefix');
        expect(inputGroupElement.children.length).toBe(2);
        expect(inputGroupElement.lastElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.firstElementChild as HTMLElement).innerText).toBe('before');
      });

      it('should before content template work', () => {
        testComponent.beforeContent = testComponent.beforeTemplate;
        fixture.detectChanges();
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input-prefix');
        expect(inputGroupElement.children.length).toBe(2);
        expect(inputGroupElement.lastElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.firstElementChild as HTMLElement).innerText).toBe('beforeTemplate');
      });

      it('should after content string work', () => {
        testComponent.afterContent = 'after';
        fixture.detectChanges();
        expect(inputGroupElement.lastElementChild!.classList).toContain('ant-input-suffix');
        expect(inputGroupElement.children.length).toBe(2);
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.lastElementChild as HTMLElement).innerText).toBe('after');
      });

      it('should after content template work', () => {
        testComponent.afterContent = testComponent.afterTemplate;
        fixture.detectChanges();
        expect(inputGroupElement.lastElementChild!.classList).toContain('ant-input-suffix');
        expect(inputGroupElement.children.length).toBe(2);
        expect(inputGroupElement.firstElementChild!.classList).toContain('ant-input');
        expect((inputGroupElement.lastElementChild as HTMLElement).innerText).toBe('afterTemplate');
      });

      it('should size work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-affix-wrapper');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-affix-wrapper-lg');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-affix-wrapper-sm');
      });

      it('should disabled work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputGroupElement.classList).not.toContain('ant-input-affix-wrapper-disabled');
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-affix-wrapper-disabled');
      });

      it('should focus work', () => {
        testComponent.beforeContent = 'before';
        fixture.detectChanges();
        expect(inputGroupElement.classList).not.toContain('ant-input-affix-wrapper-focused');
        dispatchFakeEvent(inputGroupElement.querySelector('input')!, 'focus');
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-affix-wrapper-focused');
      });
    });

    describe('multiple', () => {
      let fixture: ComponentFixture<TriTestInputGroupMultipleComponent>;
      let testComponent: TriTestInputGroupMultipleComponent;
      let inputGroupElement: HTMLElement;
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputGroupMultipleComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputGroupElement = fixture.debugElement.query(By.directive(TriInputGroupComponent)).nativeElement;
      });

      it('should search work', () => {
        expect(inputGroupElement.classList).not.toContain('ant-input-search-enter-button');
        expect(inputGroupElement.classList).not.toContain('ant-input-search');
        testComponent.search = true;
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-search-enter-button');
        expect(inputGroupElement.classList).toContain('ant-input-search');
      });

      it('should size work', () => {
        expect(inputGroupElement.classList).toContain('ant-input-group');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-group-lg');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-group-sm');
      });

      it('should search size work', () => {
        testComponent.search = true;
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-search');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-search-large');
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputGroupElement.classList).toContain('ant-input-search-sm');
      });
    });

    describe('mix', () => {
      let fixture: ComponentFixture<TriTestInputGroupMixComponent>;
      let inputGroupElement: HTMLElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputGroupMixComponent);
        fixture.detectChanges();
        inputGroupElement = fixture.debugElement.query(By.directive(TriInputGroupComponent)).nativeElement;
      });

      it('should mix work', () => {
        expect(inputGroupElement.querySelector('.ant-input-affix-wrapper')!.nextElementSibling!.classList).toContain(
          'ant-input-group-addon'
        );
      });
    });

    describe('status', () => {
      let fixture: ComponentFixture<TriTestInputGroupWithStatusComponent>;
      let inputElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputGroupWithStatusComponent);
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.directive(TriInputGroupComponent));
      });

      it('should className correct with prefix', () => {
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-affix-wrapper-status-error');

        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputElement.nativeElement.className).toContain('ant-input-affix-wrapper-status-warning');

        fixture.componentInstance.status = '';
        fixture.detectChanges();
        expect(inputElement.nativeElement.className).not.toContain('ant-input-affix-wrapper-status-warning');
      });

      it('should className correct with addon', () => {
        fixture.componentInstance.isAddon = true;
        fixture.detectChanges();
        // re-query input element
        inputElement = fixture.debugElement.query(By.directive(TriInputGroupComponent));
        expect(inputElement.nativeElement.classList).toContain('ant-input-group-wrapper-status-error');

        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputElement.nativeElement.className).toContain('ant-input-group-wrapper-status-warning');

        fixture.componentInstance.status = '';
        fixture.detectChanges();
        expect(inputElement.nativeElement.className).not.toContain('ant-input-group-wrapper-status-warning');
      });
    });

    describe('in form', () => {
      let fixture: ComponentFixture<TriTestInputGroupInFormComponent>;
      let inputElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputGroupInFormComponent);
        inputElement = fixture.debugElement.query(By.directive(TriInputGroupComponent));
        fixture.detectChanges();
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-affix-wrapper-status-error');
        expect(inputElement.nativeElement.querySelector('nz-form-item-feedback-icon')).toBeTruthy();

        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-affix-wrapper-status-warning');

        fixture.componentInstance.status = 'success';
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-affix-wrapper-status-success');

        fixture.componentInstance.feedback = false;
        fixture.detectChanges();
        expect(inputElement.nativeElement.querySelector('nz-form-item-feedback-icon')).toBeNull();
      });

      it('should className correct with addon', () => {
        fixture.componentInstance.addon = 'before';
        fixture.detectChanges();
        fixture.componentInstance.status = 'warning';
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-group-wrapper-status-warning');
        expect(inputElement.nativeElement.classList).not.toContain('ant-input-affix-wrapper-status-warning');
      });
    });
  });
});

@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-group [addOnBefore]="beforeContent" [addOnAfter]="afterContent" [size]="size">
      <input type="text" tri-input />
    </tri-input-group>
    <ng-template #beforeTemplate>beforeTemplate</ng-template>
    <ng-template #afterTemplate>afterTemplate</ng-template>
  `
})
export class TriTestInputGroupAddonComponent {
  @ViewChild('beforeTemplate', { static: false }) beforeTemplate!: TemplateRef<void>;
  @ViewChild('afterTemplate', { static: false }) afterTemplate!: TemplateRef<void>;
  beforeContent?: string | TemplateRef<void>;
  afterContent?: string | TemplateRef<void>;
  size: TriSizeLDSType = 'default';
}

@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-group [prefix]="beforeContent" [suffix]="afterContent" [size]="size">
      <input type="text" tri-input [disabled]="disabled" />
    </tri-input-group>
    <ng-template #beforeTemplate>beforeTemplate</ng-template>
    <ng-template #afterTemplate>afterTemplate</ng-template>
  `
})
export class TriTestInputGroupAffixComponent {
  @ViewChild('beforeTemplate', { static: false }) beforeTemplate!: TemplateRef<void>;
  @ViewChild('afterTemplate', { static: false }) afterTemplate!: TemplateRef<void>;
  beforeContent?: string | TemplateRef<void>;
  afterContent?: string | TemplateRef<void>;
  size: TriSizeLDSType = 'default';
  disabled = false;
}

@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-group [search]="search" [size]="size">
      <input type="text" tri-input />
      <input type="text" tri-input />
    </tri-input-group>
  `
})
export class TriTestInputGroupMultipleComponent {
  search = false;
  size: TriSizeLDSType = 'default';
}

/** https://github.com/NG-ZORRO/ng-zorro-antd/issues/1795 **/
@Component({
  imports: [TriInputModule],
  template: `
    <tri-input-group prefixIcon="user" addOnAfter="@example.com">
      <input type="text" tri-input placeholder="邮箱地址" />
    </tri-input-group>
  `
})
export class TriTestInputGroupMixComponent {}

@Component({
  imports: [FormsModule, TriGridModule, TriInputModule],
  template: `
    <tri-input-group>
      <div tri-col span="4">
        <input type="text" tri-input [ngModel]="'0571'" />
      </div>
      <div tri-col span="8">
        <input type="text" tri-input [ngModel]="'26888888'" />
      </div>
    </tri-input-group>
  `
})
export class TriTestInputGroupColComponent {}

@Component({
  imports: [TriInputModule, TriIconModule],
  template: `
    @if (!isAddon) {
      <tri-input-group [prefix]="prefixTemplateClock" [status]="status">
        <input type="text" tri-input />
      </tri-input-group>
      <ng-template #prefixTemplateClock>
        <tri-icon type="clock-circle" theme="outline" />
      </ng-template>
    } @else {
      <tri-input-group addOnAfterIcon="setting" [status]="status">
        <input type="text" tri-input />
      </tri-input-group>
    }
  `
})
export class TriTestInputGroupWithStatusComponent {
  isAddon = false;
  status: TriStatus = 'error';
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-control [hasFeedback]="feedback" [validateStatus]="status">
          <tri-input-group [addOnBefore]="addon">
            <input type="text" tri-input />
          </tri-input-group>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriTestInputGroupInFormComponent {
  status: TriFormControlStatusType = 'error';
  feedback = true;
  addon: string = '';
}
