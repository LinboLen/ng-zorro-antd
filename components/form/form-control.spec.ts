/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AnimationCallbackEvent, Component, DebugElement, inject, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { nextAnimationFrame } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { en_US, TriI18nService } from 'ng-zorro-antd/i18n';
import { TriInputModule } from 'ng-zorro-antd/input';

import { TriFormControlComponent } from './form-control.component';
import { TriFormItemComponent } from './form-item.component';
import { TriFormModule } from './form.module';

const statusMap = {
  warning: 'ant-form-item-has-warning',
  validating: 'ant-form-item-is-validating',
  pending: 'ant-form-item-is-validating',
  error: 'ant-form-item-has-error',
  success: 'ant-form-item-has-success'
};

describe('form-control', () => {
  describe('static status', () => {
    let fixture: ComponentFixture<TriTestStaticFormControlComponent>;
    let testComponent: TriTestStaticFormControlComponent;
    let formItem: DebugElement;
    let formControl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestStaticFormControlComponent);
      testComponent = fixture.componentInstance;
      formItem = fixture.debugElement.query(By.directive(TriFormItemComponent));
      formControl = fixture.debugElement.query(By.directive(TriFormControlComponent));
    });

    it('should className correct', () => {
      expect(formControl.nativeElement.classList).toContain('ant-form-item-control');
    });

    it('should status work', () => {
      const statusList: Array<keyof typeof statusMap> = ['warning', 'validating', 'pending', 'error', 'success'];
      statusList.forEach(status => {
        testComponent.status.set(status);
        fixture.detectChanges();
        expect(formItem.nativeElement.classList).toContain(statusMap[status]);
      });
    });

    it('should get correct form validate animation class', () => {
      expect(formControl.componentInstance.nzValidateAnimationEnter()).toBe('ant-form-validate_animation-enter');
      expect(formControl.componentInstance.nzValidateAnimationLeave()).toBe('ant-form-validate_animation-leave');
    });
  });

  describe('reactive status', () => {
    let fixture: ComponentFixture<TriTestReactiveFormControlComponent>;
    let formGroup: FormGroup<{
      input: FormControl<string | null>;
      input2: FormControl<string | null>;
      input3: FormControl<string | null>;
    }>;
    let formItems: DebugElement[];
    let formControls: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestReactiveFormControlComponent);
      formGroup = fixture.componentInstance.formGroup;
      formItems = fixture.debugElement.queryAll(By.directive(TriFormItemComponent));
      formControls = fixture.debugElement.queryAll(By.directive(TriFormControlComponent));
    });

    it('should init status correct', () => {
      expect(formItems[0].nativeElement.classList).toContain('ant-form-item');
      expect(formItems[1].nativeElement.classList).toContain('ant-form-item');
      expect(formControls[0].nativeElement.classList).toContain('ant-form-item-control');
      expect(formControls[1].nativeElement.classList).toContain('ant-form-item-control');
    });

    it('should valid work', () => {
      formGroup.get('input')!.markAsDirty();
      formGroup.get('input2')!.markAsDirty();
      formGroup.get('input')!.setValue('123');
      formGroup.get('input2')!.setValue('123');
      formGroup.get('input')!.updateValueAndValidity();
      formGroup.get('input2')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formItems[0].nativeElement.classList).toContain(statusMap.success);
      expect(formItems[1].nativeElement.classList).toContain(statusMap.success);
    });

    it('should invalid work', () => {
      formGroup.get('input')!.markAsDirty();
      formGroup.get('input2')!.markAsDirty();
      formGroup.get('input')!.setValue('');
      formGroup.get('input2')!.setValue('');
      formGroup.get('input')!.updateValueAndValidity();
      formGroup.get('input2')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formItems[0].nativeElement.classList).toContain(statusMap.error);
      expect(formItems[1].nativeElement.classList).toContain(statusMap.error);
    });

    it('should dirty work', () => {
      formGroup.get('input')!.markAsDirty();
      formGroup.get('input2')!.markAsDirty();
      formGroup.get('input')!.updateValueAndValidity();
      formGroup.get('input2')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formItems[0].nativeElement.classList).toContain(statusMap.error);
      expect(formItems[1].nativeElement.classList).toContain(statusMap.error);

      formGroup.get('input')!.markAsPristine();
      formGroup.get('input2')!.markAsPristine();
      formGroup.get('input')!.updateValueAndValidity();
      formGroup.get('input2')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formItems[0].nativeElement.classList).not.toContain(statusMap.error);
      expect(formItems[1].nativeElement.classList).not.toContain(statusMap.error);
    });

    it('should pending work', () => {
      formGroup.get('input')!.markAsPending();
      formGroup.get('input2')!.markAsPending();
      formGroup.get('input')!.updateValueAndValidity();
      formGroup.get('input2')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formItems[0].nativeElement.classList).not.toContain(statusMap.error);
      expect(formItems[1].nativeElement.classList).not.toContain(statusMap.error);
    });
  });

  describe('reactive init status', () => {
    let fixture: ComponentFixture<TriTestReactiveFormControlInitStatusComponent>;
    let testComponent: TriTestReactiveFormControlInitStatusComponent;
    let formItem: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestReactiveFormControlInitStatusComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      formItem = fixture.debugElement.query(By.directive(TriFormItemComponent));
    });

    it('should init status correct', () => {
      expect(formItem.nativeElement.classList).toContain(statusMap.error);
    });

    it('should warning status work', () => {
      testComponent.formGroup.get('input')!.setErrors({ warning: true });
      fixture.detectChanges();

      expect(formItem.nativeElement.classList).toContain(statusMap.warning);
    });
  });

  describe('auto tips', () => {
    let fixture: ComponentFixture<TriTestReactiveFormAutoTipsComponent>;
    let testComponent: TriTestReactiveFormAutoTipsComponent;
    let formGroup: FormGroup<{
      username: FormControl<string | null>;
      mobile: FormControl<string | null>;
      email: FormControl<string | null>;
      password: FormControl<string | null>;
      confirmPassword: FormControl<string | null>;
    }>;
    let formControls: DebugElement[];

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNzNoAnimation()]
      });

      fixture = TestBed.createComponent(TriTestReactiveFormAutoTipsComponent);
      testComponent = fixture.componentInstance;
      formGroup = testComponent.formGroup;
      formControls = fixture.debugElement.queryAll(By.directive(TriFormControlComponent));
    });

    it('should default work ', () => {
      formGroup.get('username')!.markAsDirty();
      formGroup.get('mobile')!.markAsDirty();
      formGroup.get('email')!.markAsDirty();
      formGroup.get('password')!.markAsDirty();
      formGroup.get('confirmPassword')!.markAsDirty();
      formGroup.get('username')!.updateValueAndValidity();
      formGroup.get('mobile')!.updateValueAndValidity();
      formGroup.get('email')!.updateValueAndValidity();
      formGroup.get('password')!.updateValueAndValidity();
      formGroup.get('confirmPassword')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('必填项');
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('必填项');
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        '请输入邮箱/Input is required'
      );
      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('必填项');

      fixture.detectChanges();

      formGroup.get('username')!.setValue('12345');
      formGroup.get('mobile')!.setValue('12345');
      formGroup.get('email')!.setValue('12345');

      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(`最小长度为 6`);
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        '手机号码格式不正确'
      );
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        '请输入正确的邮箱'
      );

      fixture.detectChanges();

      testComponent.formAutoTips.set({
        'zh-cn': {
          required: '请输入',
          email: '邮箱格式不正确'
        },
        en: {
          required: 'Input is required',
          email: 'The input is not valid email'
        }
      });
      fixture.detectChanges();

      formGroup.get('username')!.setValue('');
      formGroup.get('mobile')!.setValue('');
      formGroup.get('email')!.setValue('');

      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        '请输入邮箱/Input is required'
      );
      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');

      fixture.detectChanges();

      testComponent.showConfirmPassword.set(true);
      fixture.detectChanges();

      formGroup.get('username')!.setValue('');
      formGroup.get('mobile')!.setValue('');
      formGroup.get('email')!.setValue('');
      fixture.detectChanges();

      formControls = fixture.debugElement.queryAll(By.directive(TriFormControlComponent));

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        '请输入邮箱/Input is required'
      );
      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');
      expect(formControls[4].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual('请输入');
    });

    it('should i18n work ', () => {
      formGroup.get('username')!.markAsDirty();
      formGroup.get('mobile')!.markAsDirty();
      formGroup.get('email')!.markAsDirty();
      formGroup.get('username')!.updateValueAndValidity();
      formGroup.get('mobile')!.updateValueAndValidity();
      formGroup.get('email')!.updateValueAndValidity();

      fixture.detectChanges();

      testComponent.i18n.setLocale(en_US);
      fixture.detectChanges();

      formGroup.get('username')!.setValue('');
      formGroup.get('mobile')!.setValue('');
      formGroup.get('email')!.setValue('');
      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Input is required'
      );
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Input is required'
      );
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        '请输入邮箱/Input is required'
      );

      formGroup.get('username')!.setValue('12345');
      formGroup.get('mobile')!.setValue('12345');
      formGroup.get('email')!.setValue('12345');

      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        `MinLength is 6`
      );
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Mobile phone number is not valid'
      );
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Please input valid email'
      );
    });

    it('should nzDisableAutoTips work ', async () => {
      formGroup.get('username')!.markAsDirty();
      formGroup.get('mobile')!.markAsDirty();
      formGroup.get('email')!.markAsDirty();
      formGroup.get('password')!.markAsDirty();
      formGroup.get('username')!.updateValueAndValidity();
      formGroup.get('mobile')!.updateValueAndValidity();
      formGroup.get('email')!.updateValueAndValidity();
      formGroup.get('password')!.updateValueAndValidity();

      fixture.detectChanges();

      testComponent.passwordDisableAutoTips.set(true);
      fixture.detectChanges();

      formGroup.get('password')!.updateValueAndValidity();
      fixture.detectChanges();

      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Please input your password!'
      );

      testComponent.formDisableAutoTips.set(true);
      fixture.detectChanges();

      formGroup.get('username')!.setValue('12345');
      formGroup.get('mobile')!.setValue('12345');
      formGroup.get('email')!.setValue('12345');
      fixture.detectChanges();
      await nextAnimationFrame();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
    });

    it('should nzErrorTip change work', () => {
      testComponent.passwordDisableAutoTips.set(true);

      formGroup.get('password')!.markAsDirty();
      formGroup.get('password')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Please input your password!'
      );

      const passwordErrorTip = '请输入密码';
      testComponent.passwordErrorTip.set(passwordErrorTip);
      fixture.detectChanges();

      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        passwordErrorTip
      );
    });
  });

  describe('NoopAnimations', () => {
    let fixture: ComponentFixture<TriTestNoopAnimationsFormControlComponent>;
    let formGroup: FormGroup<{ input: FormControl<string | null> }>;
    let formControl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNzNoAnimation()]
      });
      fixture = TestBed.createComponent(TriTestNoopAnimationsFormControlComponent);
      formGroup = fixture.componentInstance.formGroup;
      formControl = fixture.debugElement.query(By.directive(TriFormControlComponent));
    });

    it('should call animationComplete immediately when animations are disabled', () => {
      formGroup.get('input')!.markAsDirty();
      formGroup.get('input')!.updateValueAndValidity();
      fixture.detectChanges();

      expect(formControl.nativeElement.querySelector('.ant-form-item-explain')).not.toBeNull();

      const mockEvent: AnimationCallbackEvent = {
        target: formControl.nativeElement.querySelector('.ant-form-item-explain'),
        animationComplete: vi.fn()
      };

      formControl.componentInstance.onAnimationLeave(mockEvent);

      expect(mockEvent.animationComplete).toHaveBeenCalled();
    });

    it('should return nz-animate-disabled class when animations are disabled', () => {
      expect(formControl.componentInstance.nzValidateAnimationEnter()).toBe('nz-animate-disabled');
      expect(formControl.componentInstance.nzValidateAnimationLeave()).toBe('nz-animate-disabled');
    });
  });

  // https://github.com/NG-ZORRO/ng-zorro-antd/issues/9714
  describe('signal forms', () => {
    let fixture: ComponentFixture<TriTestSignalFormControlComponent>;
    let testComponent: TriTestSignalFormControlComponent;
    let formItem: DebugElement;
    let formControl: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestSignalFormControlComponent);
      testComponent = fixture.componentInstance;
      formItem = fixture.debugElement.query(By.directive(TriFormItemComponent));
      formControl = fixture.debugElement.query(By.directive(TriFormControlComponent));
      fixture.detectChanges();
    });

    it('should not show error before the field is touched', () => {
      expect(formItem.nativeElement.classList).not.toContain(statusMap.error);
      expect(formControl.nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
    });

    it('should display the error tip once the invalid field is touched', () => {
      testComponent.userForm.name().markAsTouched();
      fixture.detectChanges();

      expect(formItem.nativeElement.classList).toContain(statusMap.error);
      expect(formControl.nativeElement.querySelector('.ant-form-item-explain').textContent).toContain(
        'Name is required!'
      );
    });

    it('should clear the error once the field becomes valid', () => {
      testComponent.userForm.name().markAsTouched();
      fixture.detectChanges();
      expect(formItem.nativeElement.classList).toContain(statusMap.error);

      testComponent.model.set({ name: 'NG-ZORRO' });
      fixture.detectChanges();

      expect(formItem.nativeElement.classList).not.toContain(statusMap.error);
      expect(formItem.nativeElement.classList).toContain(statusMap.success);
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `
    <tri-form-item>
      <tri-form-control [hasFeedback]="hasFeedback()" [validateStatus]="status()" />
    </tri-form-item>
  `
})
export class TriTestStaticFormControlComponent {
  readonly hasFeedback = signal(false);
  readonly status = signal<'success' | 'warning' | 'validating' | 'pending' | 'error'>('success');
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule],
  template: `
    <form [formGroup]="formGroup">
      <tri-form-item>
        <tri-form-control>
          <input formControlName="input" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [validateStatus]="validateStatus">
          <input formControlName="input3" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-control>
        <input formControlName="input2" />
      </tri-form-control>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestReactiveFormControlComponent {
  private readonly formBuilder = inject(FormBuilder);

  formGroup = this.formBuilder.group({
    input: this.formBuilder.control('', [Validators.required]),
    input2: this.formBuilder.control('', [Validators.required]),
    input3: this.formBuilder.control('', [Validators.required])
  });
  validateStatus = this.formGroup.controls.input2;
}

/** https://github.com/NG-ZORRO/ng-zorro-antd/issues/1170 **/
@Component({
  imports: [ReactiveFormsModule, TriFormModule],
  template: `
    <form [formGroup]="formGroup">
      <tri-form-item>
        <tri-form-control>
          <input formControlName="input" />
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestReactiveFormControlInitStatusComponent {
  private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.group({
    input: ['', [Validators.required]]
  });

  constructor() {
    this.formGroup.controls.input.markAsDirty();
  }
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule, TriInputModule],
  template: `
    <form [formGroup]="formGroup" tri-form [autoTips]="formAutoTips()" [disableAutoTips]="formDisableAutoTips()">
      <tri-form-item>
        <tri-form-control #control>
          <input tri-input formControlName="username" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control>
          <input tri-input formControlName="mobile" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [autoTips]="emailAutoTips">
          <input tri-input formControlName="email" type="email" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [disableAutoTips]="passwordDisableAutoTips()" [errorTip]="passwordErrorTip()">
          <input tri-input type="password" formControlName="password" />
        </tri-form-control>
      </tri-form-item>
      @if (showConfirmPassword()) {
        <tri-form-item>
          <tri-form-control>
            <input tri-input type="password" formControlName="confirmPassword" />
          </tri-form-control>
        </tri-form-item>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestReactiveFormAutoTipsComponent {
  private readonly formBuilder = inject(FormBuilder);
  public readonly i18n = inject(TriI18nService);

  formGroup = this.formBuilder.group({
    username: this.formBuilder.control('', [MyValidators.required, MyValidators.minLength(6)]),
    mobile: this.formBuilder.control('', [MyValidators.required, MyValidators.mobile]),
    email: this.formBuilder.control('', [MyValidators.required, MyValidators.email]),
    password: this.formBuilder.control('', [MyValidators.required]),
    confirmPassword: this.formBuilder.control('', [MyValidators.required])
  });

  readonly showConfirmPassword = signal(false);
  readonly formDisableAutoTips = signal(false);
  readonly passwordDisableAutoTips = signal(false);
  readonly passwordErrorTip = signal('Please input your password!');
  readonly formAutoTips = signal({
    'zh-cn': {
      required: '必填项',
      email: '邮箱格式不正确'
    },
    en: {
      required: 'Input is required',
      email: 'The input is not valid email'
    }
  });
  emailAutoTips = {
    'zh-cn': {
      email: '请输入正确的邮箱'
    },
    en: {
      email: 'Please input valid email'
    },
    default: {
      required: '请输入邮箱/Input is required'
    }
  };
}

export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<string, TriSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': `最小长度为 ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }

  static mobile(control: AbstractControl): MyValidationErrors | null {
    const value = control.value;

    if (isEmptyInputValue(value) || isMobile(value)) {
      return null;
    }

    return { mobile: { 'zh-cn': `手机号码格式不正确`, en: `Mobile phone number is not valid` } };
  }
}

function isEmptyInputValue(value: TriSafeAny): boolean {
  return value == null || value.length === 0;
}

function isMobile(value: string): boolean {
  return typeof value === 'string' && /(^1\d{10}$)/.test(value);
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule],
  template: `
    <form [formGroup]="formGroup">
      <tri-form-item>
        <tri-form-control errorTip="This field is required">
          <input formControlName="input" />
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriTestNoopAnimationsFormControlComponent {
  private readonly formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.group({
    input: this.formBuilder.control('', [Validators.required])
  });
}

@Component({
  imports: [TriFormModule, TriInputModule, FormField],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-control errorTip="Name is required!">
          <input tri-input [formField]="userForm.name" />
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriTestSignalFormControlComponent {
  readonly model = signal({ name: '' });
  readonly userForm = form(this.model, path => {
    required(path.name, { message: 'Name is required!' });
  });
}
