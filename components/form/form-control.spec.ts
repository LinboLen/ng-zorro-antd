/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { en_US, TriI18nService } from 'ng-zorro-antd/i18n';
import { TriInputModule } from 'ng-zorro-antd/input';

import { TriFormControlComponent } from './form-control.component';
import { TriFormItemComponent } from './form-item.component';
import { TriFormModule } from './form.module';

const testBedOptions = { imports: [NoopAnimationsModule] };
const statusMap = {
  warning: 'ant-form-item-has-warning',
  validating: 'ant-form-item-is-validating',
  pending: 'ant-form-item-is-validating',
  error: 'ant-form-item-has-error',
  success: 'ant-form-item-has-success'
};

describe('nz-form-control', () => {
  describe('static status', () => {
    let fixture: ComponentFixture<TriTestStaticFormControlComponent>;
    let testComponent: TriTestStaticFormControlComponent;
    let formItem: DebugElement;
    let formControl: DebugElement;
    beforeEach(() => {
      TestBed.configureTestingModule(testBedOptions);
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
        testComponent.status = status;
        fixture.detectChanges();
        expect(formItem.nativeElement.classList).toContain(statusMap[status]);
      });
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
      TestBed.configureTestingModule(testBedOptions);
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
      TestBed.configureTestingModule(testBedOptions);
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
      TestBed.configureTestingModule(testBedOptions);
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

      testComponent.formAutoTips = {
        'zh-cn': {
          required: '请输入',
          email: '邮箱格式不正确'
        },
        en: {
          required: 'Input is required',
          email: 'The input is not valid email'
        }
      };
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

      testComponent.showConfirmPassword = true;
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
    it('should nzDisableAutoTips work ', fakeAsync(() => {
      formGroup.get('username')!.markAsDirty();
      formGroup.get('mobile')!.markAsDirty();
      formGroup.get('email')!.markAsDirty();
      formGroup.get('password')!.markAsDirty();
      formGroup.get('username')!.updateValueAndValidity();
      formGroup.get('mobile')!.updateValueAndValidity();
      formGroup.get('email')!.updateValueAndValidity();
      formGroup.get('password')!.updateValueAndValidity();

      fixture.detectChanges();

      testComponent.passwordDisableAutoTips = true;
      fixture.detectChanges();

      formGroup.get('password')!.updateValueAndValidity();
      fixture.detectChanges();

      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Please input your password!'
      );

      testComponent.formDisableAutoTips = true;
      fixture.detectChanges();

      formGroup.get('username')!.setValue('12345');
      formGroup.get('mobile')!.setValue('12345');
      formGroup.get('email')!.setValue('12345');

      fixture.detectChanges();
      tick(300 + 50);
      fixture.detectChanges();

      expect(formControls[0].nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
      expect(formControls[1].nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
      expect(formControls[2].nativeElement.querySelector('.ant-form-item-explain')).toBeNull();
    }));
    it('should nzErrorTip change work', () => {
      testComponent.passwordDisableAutoTips = true;

      formGroup.get('password')!.markAsDirty();
      formGroup.get('password')!.updateValueAndValidity();

      fixture.detectChanges();

      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        'Please input your password!'
      );

      const passwordErrorTip = '请输入密码';
      testComponent.passwordErrorTip = passwordErrorTip;

      fixture.detectChanges();

      expect(formControls[3].nativeElement.querySelector('.ant-form-item-explain').textContent).toEqual(
        passwordErrorTip
      );
    });
  });
});

@Component({
  imports: [TriFormModule],
  template: `
    <tri-form-item>
      <tri-form-control [hasFeedback]="hasFeedback" [validateStatus]="status"></tri-form-control>
    </tri-form-item>
  `
})
export class TriTestStaticFormControlComponent {
  hasFeedback = false;
  status = 'success';
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
  `
})
export class TriTestReactiveFormControlComponent {
  formGroup: FormGroup<{
    input: FormControl<string | null>;
    input2: FormControl<string | null>;
    input3: FormControl<string | null>;
  }>;
  validateStatus: FormControl<string | null>;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      input: this.formBuilder.control('', [Validators.required]),
      input2: this.formBuilder.control('', [Validators.required]),
      input3: this.formBuilder.control('', [Validators.required])
    });
    this.validateStatus = this.formGroup.controls.input2;
  }
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
  `
})
export class TriTestReactiveFormControlInitStatusComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      input: ['', [Validators.required]]
    });
    this.formGroup.controls.input.markAsDirty();
  }
}

@Component({
  imports: [ReactiveFormsModule, TriFormModule, TriInputModule],
  template: `
    <form [formGroup]="formGroup" tri-form [autoTips]="formAutoTips" [disableAutoTips]="formDisableAutoTips">
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
        <tri-form-control [disableAutoTips]="passwordDisableAutoTips" [errorTip]="passwordErrorTip">
          <input tri-input type="password" formControlName="password" />
        </tri-form-control>
      </tri-form-item>
      @if (showConfirmPassword) {
        <tri-form-item>
          <tri-form-control>
            <input tri-input type="password" formControlName="confirmPassword" />
          </tri-form-control>
        </tri-form-item>
      }
    </form>
  `
})
export class TriTestReactiveFormAutoTipsComponent {
  formGroup: FormGroup<{
    username: FormControl<string | null>;
    mobile: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  showConfirmPassword = false;

  formDisableAutoTips = false;
  passwordDisableAutoTips = false;
  passwordErrorTip = 'Please input your password!';

  formAutoTips = {
    'zh-cn': {
      required: '必填项',
      email: '邮箱格式不正确'
    },
    en: {
      required: 'Input is required',
      email: 'The input is not valid email'
    }
  };
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

  constructor(
    private formBuilder: FormBuilder,
    public i18n: TriI18nService
  ) {
    const { required, minLength, email, mobile } = MyValidators;
    this.formGroup = this.formBuilder.group({
      username: ['', [required, minLength(6)]],
      mobile: ['', [required, mobile]],
      email: ['', [required, email]],
      password: ['', [required]],
      confirmPassword: ['', [required]]
    });
  }
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

    if (isEmptyInputValue(value)) {
      return null;
    }

    return isMobile(value)
      ? null
      : { mobile: { 'zh-cn': `手机号码格式不正确`, en: `Mobile phone number is not valid` } };
  }
}

function isEmptyInputValue(value: TriSafeAny): boolean {
  return value == null || value.length === 0;
}

function isMobile(value: string): boolean {
  return typeof value === 'string' && /(^1\d{10}$)/.test(value);
}
