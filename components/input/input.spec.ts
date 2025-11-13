/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TriSizeLDSType, TriStatus, TriVariant } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { TriInputWrapperComponent } from 'ng-zorro-antd/input/input-wrapper.component';

import { TriFormControlStatusType, TriFormModule } from '../form';
import { TriInputDirective } from './input.directive';
import { TriInputModule } from './input.module';

describe('input', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting()]
    });
  }));
  describe('single input', () => {
    describe('input with input element', () => {
      let fixture: ComponentFixture<TriTestInputWithInputComponent>;
      let testComponent: TriTestInputWithInputComponent;
      let inputElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputWithInputComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
      });
      it('should className correct', () => {
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input');
      });
      it('should disabled work', () => {
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).not.toContain('ant-input-disabled');
        testComponent.disabled = true;
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-disabled');
      });
      it('should nzSize work', () => {
        testComponent.size = 'small';
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input');
        expect(inputElement.nativeElement.classList).toContain('ant-input-sm');
        testComponent.size = 'large';
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input');
        expect(inputElement.nativeElement.classList).toContain('ant-input-lg');
      });
      it('should nzStepperLess work', () => {
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-stepperless');
        testComponent.stepperless = false;
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).not.toContain('ant-input-stepperless');
      });
      it('should nzBorderless work', () => {
        testComponent.borderless = true;
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-borderless');
      });
      describe('should nzVariant work', () => {
        it('filled', () => {
          fixture.detectChanges();
          expect(inputElement.nativeElement.classList).not.toContain('ant-input-filled');
          testComponent.variant = 'filled';
          fixture.detectChanges();
          expect(inputElement.nativeElement.classList).toContain('ant-input-filled');
        });
        it('borderless', () => {
          fixture.detectChanges();
          expect(inputElement.nativeElement.classList).not.toContain('ant-input-borderless');
          testComponent.variant = 'borderless';
          fixture.detectChanges();
          expect(inputElement.nativeElement.classList).toContain('ant-input-borderless');
        });
        it('underlined', () => {
          fixture.detectChanges();
          expect(inputElement.nativeElement.classList).not.toContain('ant-input-borderless');
          testComponent.variant = 'underlined';
          fixture.detectChanges();
          expect(inputElement.nativeElement.classList).toContain('ant-input-underlined');
        });
      });
    });

    describe('input with textarea element', () => {
      let fixture: ComponentFixture<TriTestInputWithInputComponent>;
      let inputElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputWithInputComponent);
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input');
      });
    });
  });

  describe('input form', () => {
    describe('input with form', () => {
      let fixture: ComponentFixture<TriTestInputFormComponent>;
      let testComponent: TriTestInputFormComponent;
      let inputElement: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestInputFormComponent);
        testComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges();
        inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
      });
      it('should set disabled work', fakeAsync(() => {
        flush();
        expect(inputElement.nativeElement.classList).not.toContain('ant-input-disabled');
        expect(inputElement.nativeElement.getAttribute('disabled')).toBeNull();
        testComponent.disable();
        flush();
        fixture.detectChanges();
        expect(inputElement.nativeElement.classList).toContain('ant-input-disabled');
        expect(inputElement.nativeElement.getAttribute('disabled')).toBe('true');
      }));
    });
  });

  describe('input RTL', () => {
    let fixture: ComponentFixture<TriTestInputWithDirComponent>;
    let inputElement: DebugElement;
    let inputGroupElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInputWithDirComponent);
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
      inputGroupElement = fixture.debugElement.query(By.directive(TriInputWrapperComponent));
    });

    it('should className correct on dir change', () => {
      expect(inputElement.nativeElement.classList).not.toContain('ant-input-rtl');
      expect(inputGroupElement.nativeElement.classList).not.toContain('ant-input-group-wrapper-rtl');

      fixture.componentInstance.dir = 'rtl';
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-rtl');
      expect(inputGroupElement.nativeElement.classList).toContain('ant-input-group-wrapper-rtl');
    });
  });

  describe('input with status', () => {
    let fixture: ComponentFixture<TriTestInputWithStatusComponent>;
    let inputElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInputWithStatusComponent);
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-status-error');

      fixture.componentInstance.status = 'warning';
      fixture.detectChanges();
      expect(inputElement.nativeElement.className).toContain('ant-input-status-warning');

      fixture.componentInstance.status = '';
      fixture.detectChanges();
      expect(inputElement.nativeElement.className).not.toContain('ant-input-status-warning');
    });
  });

  describe('input in form', () => {
    let fixture: ComponentFixture<TriTestInputInFormComponent>;
    let inputElement: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInputInFormComponent);
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-status-error');
      expect(inputElement.nativeElement.nextSibling.classList).toContain('ant-form-item-feedback-icon-error');

      fixture.componentInstance.status = 'success';
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-status-success');
      expect(inputElement.nativeElement.nextSibling.classList).toContain('ant-form-item-feedback-icon-success');

      fixture.componentInstance.status = 'warning';
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-status-warning');
      expect(inputElement.nativeElement.nextSibling.classList).toContain('ant-form-item-feedback-icon-warning');

      fixture.componentInstance.status = 'validating';
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-status-validating');
      expect(inputElement.nativeElement.nextSibling.classList).toContain('ant-form-item-feedback-icon-validating');

      fixture.componentInstance.feedback = false;
      fixture.detectChanges();
      expect(inputElement.nativeElement.classList).toContain('ant-input-status-validating');
      expect(inputElement.nativeElement.nextSibling?.classList).not.toContain('ant-form-item-feedback-icon');
    });
  });

  describe('input with type', () => {
    let fixture: ComponentFixture<TriTestInputWithTypeComponent>;
    let inputElement: DebugElement;
    let component: TriTestInputWithTypeComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestInputWithTypeComponent);
      fixture.detectChanges();
      inputElement = fixture.debugElement.query(By.directive(TriInputDirective));
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should type correct', () => {
      expect(inputElement.nativeElement.type).toEqual('text');

      component.type = 'password';
      fixture.detectChanges();
      expect(inputElement.nativeElement.type).toEqual('password');

      component.type = 'number';
      fixture.detectChanges();
      expect(inputElement.nativeElement.type).toEqual('number');

      component.type = '';
      fixture.detectChanges();
      expect(inputElement.nativeElement.type).toEqual('text');
    });
  });
});

@Component({
  imports: [BidiModule, TriInputModule, TriIconModule],
  template: `
    <div [dir]="dir">
      <input tri-input />
      <tri-input-wrapper>
        <input type="text" tri-input />
        <tri-icon inputAddonAfter type="setting" />
      </tri-input-wrapper>
    </div>
  `
})
export class TriTestInputWithDirComponent {
  dir: Direction = 'ltr';
}

@Component({
  imports: [TriInputModule],
  template: `
    <input
      tri-input
      [size]="size"
      [disabled]="disabled"
      [borderless]="borderless"
      [variant]="variant"
      [stepperless]="stepperless"
    />
  `
})
export class TriTestInputWithInputComponent {
  size: TriSizeLDSType = 'default';
  disabled = false;
  stepperless = true;
  borderless = false;
  variant: TriVariant = 'outlined';
}

@Component({
  imports: [TriInputModule],
  template: `<textarea tri-input></textarea>`
})
export class TriTestInputWithTextAreaComponent {}

@Component({
  imports: [ReactiveFormsModule, TriInputModule],
  template: `
    <form>
      <input tri-input [formControl]="formControl" />
    </form>
  `
})
export class TriTestInputFormComponent {
  formControl = new FormControl('abc');

  disable(): void {
    this.formControl.disable();
  }
}

// status
@Component({
  imports: [TriInputModule],
  template: `<input tri-input [status]="status" />`
})
export class TriTestInputWithStatusComponent {
  status: TriStatus = 'error';
}

@Component({
  imports: [TriFormModule, TriInputModule],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-control [hasFeedback]="feedback" [validateStatus]="status">
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriTestInputInFormComponent {
  status: TriFormControlStatusType = 'error';
  feedback = true;
}

@Component({
  imports: [TriInputModule],
  template: `<input tri-input [type]="type" />`
})
export class TriTestInputWithTypeComponent {
  type: string | null = null;
}
