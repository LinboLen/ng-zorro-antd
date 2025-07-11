import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriFormModule, TriFormTooltipIcon } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-form-register',
  imports: [ReactiveFormsModule, TriButtonModule, TriCheckboxModule, TriFormModule, TriInputModule, TriSelectModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [sm]="6" [xs]="24" required for="email">E-mail</tri-form-label>
        <tri-form-control [sm]="14" [xs]="24" errorTip="The input is not valid E-mail!">
          <input tri-input formControlName="email" id="email" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="6" [xs]="24" for="password" required>Password</tri-form-label>
        <tri-form-control [sm]="14" [xs]="24" errorTip="Please input your password!">
          <input tri-input type="password" id="password" formControlName="password" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="6" [xs]="24" for="checkPassword" required>Confirm Password</tri-form-label>
        <tri-form-control [sm]="14" [xs]="24" [errorTip]="errorTpl">
          <input tri-input type="password" formControlName="checkPassword" id="checkPassword" />
          <ng-template #errorTpl let-control>
            @if (control.errors?.['required']) {
              Please confirm your password!
            }
            @if (control.errors?.['confirm']) {
              Two passwords that you enter is inconsistent!
            }
          </ng-template>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label
          [sm]="6"
          [xs]="24"
          for="nickname"
          required
          tooltipTitle="What do you want other to call you"
        >
          <span>Nickname</span>
        </tri-form-label>
        <tri-form-control [sm]="14" [xs]="24" errorTip="Please input your nickname!">
          <input tri-input id="nickname" formControlName="nickname" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="6" [xs]="24" for="phoneNumber" required>Phone Number</tri-form-label>
        <tri-form-control
          [sm]="14"
          [xs]="24"
          [validateStatus]="validateForm.controls['phoneNumber']"
          errorTip="Please input your phone number!"
        >
          <tri-input-group [addOnBefore]="addOnBeforeTemplate">
            <ng-template #addOnBeforeTemplate>
              <tri-select formControlName="phoneNumberPrefix" class="phone-select">
                <tri-option label="+86" value="+86"></tri-option>
                <tri-option label="+87" value="+87"></tri-option>
              </tri-select>
            </ng-template>
            <input formControlName="phoneNumber" id="'phoneNumber'" tri-input />
          </tri-input-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [sm]="6" [xs]="24" for="website" required>Website</tri-form-label>
        <tri-form-control [sm]="14" [xs]="24" errorTip="Please input website!">
          <input tri-input id="website" formControlName="website" placeholder="website" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label
          [sm]="6"
          [xs]="24"
          for="captcha"
          required
          tooltipTitle="Please click 'Get captcha'"
          [tooltipIcon]="captchaTooltipIcon"
        >
          Captcha
        </tri-form-label>
        <tri-form-control
          [sm]="14"
          [xs]="24"
          errorTip="Please input the captcha you got!"
          extra="We must make sure that your are a human."
        >
          <div tri-row [gutter]="8">
            <div tri-col [span]="12">
              <input tri-input formControlName="captcha" id="captcha" />
            </div>
            <div tri-col [span]="12">
              <button tri-button (click)="getCaptcha($event)">Get captcha</button>
            </div>
          </div>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row class="register-area">
        <tri-form-control [span]="14" [offset]="6">
          <label tri-checkbox formControlName="agree">
            <span>
              I have read the
              <a>agreement</a>
            </span>
          </label>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row class="register-area">
        <tri-form-control [span]="14" [offset]="6">
          <button tri-button type="primary">Register</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: [
    `
      [nz-form] {
        max-width: 600px;
      }

      .ant-select.ant-select-in-form-item.phone-select {
        width: 80px;
      }

      .register-area {
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoFormRegisterComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
    checkPassword: this.fb.control('', [Validators.required, this.confirmationValidator]),
    nickname: this.fb.control('', [Validators.required]),
    phoneNumberPrefix: this.fb.control<'+86' | '+87'>('+86'),
    phoneNumber: this.fb.control('', [Validators.required]),
    website: this.fb.control('', [Validators.required]),
    captcha: this.fb.control('', [Validators.required]),
    agree: this.fb.control(false)
  });
  captchaTooltipIcon: TriFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm.controls.checkPassword.updateValueAndValidity();
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

  confirmationValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
}
