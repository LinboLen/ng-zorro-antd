import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-auto-tips',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [autoTips]="autoTips" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [span]="7" required>Username</tri-form-label>
        <tri-form-control [span]="12" validatingTip="Validating...">
          <input tri-input formControlName="username" placeholder="async validate try to write JasonWood" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>Mobile</tri-form-label>
        <tri-form-control [span]="12">
          <input tri-input formControlName="mobile" placeholder="mobile" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>E-mail</tri-form-label>
        <tri-form-control [span]="12">
          <input tri-input formControlName="email" placeholder="email" type="email" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>Password</tri-form-label>
        <tri-form-control [span]="12" disableAutoTips errorTip="Please input your password!">
          <input tri-input type="password" formControlName="password" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>Confirm Password</tri-form-label>
        <tri-form-control [span]="12" disableAutoTips [errorTip]="passwordErrorTpl">
          <input tri-input type="password" formControlName="confirm" placeholder="confirm your password" />
          <ng-template #passwordErrorTpl let-control>
            @if (control.errors?.['required']) {
              Please confirm your password!
            }
            @if (control.errors?.['confirm']) {
              Password is inconsistent!
            }
          </ng-template>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [offset]="7" [span]="12">
          <button tri-button type="primary">Submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: `
    [nz-form] {
      max-width: 600px;
    }
  `
})
export class TriDemoFormAutoTipsComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    username: this.fb.control(
      '',
      [MyValidators.required, MyValidators.maxLength(12), MyValidators.minLength(6)],
      [this.usernameAsyncValidator]
    ),
    mobile: this.fb.control('', [MyValidators.required, MyValidators.mobile]),
    email: this.fb.control('', [MyValidators.required, MyValidators.email]),
    password: this.fb.control('', [MyValidators.required]),
    confirm: this.fb.control('', [this.confirmValidator])
  });

  // current locale is key of the nzAutoTips
  // if it is not found, it will be searched again with `default`
  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项'
    },
    en: {
      required: 'Input is required'
    },
    default: {
      email: '邮箱格式不正确/The input is not valid email'
    }
  };

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm.controls.confirm.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  usernameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({
            duplicated: { 'zh-cn': `用户名已存在`, en: `The username is redundant!` }
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  }

  confirmValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }
}

// current locale is key of the MyErrorsOptions
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

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { 'zh-cn': `最大长度为 ${maxLength}`, en: `MaxLength is ${maxLength}` } };
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
