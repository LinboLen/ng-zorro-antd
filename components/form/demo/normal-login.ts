import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriButtonModule, TriCheckboxModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" class="login-form" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-control errorTip="Please input your username!">
          <tri-input-group prefixIcon="user">
            <input type="text" tri-input formControlName="username" placeholder="Username" />
          </tri-input-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control errorTip="Please input your Password!">
          <tri-input-group prefixIcon="lock">
            <input type="password" tri-input formControlName="password" placeholder="Password" />
          </tri-input-group>
        </tri-form-control>
      </tri-form-item>
      <div tri-row class="login-form-margin">
        <div tri-col [span]="12">
          <label tri-checkbox formControlName="remember">
            <span>Remember me</span>
          </label>
        </div>
        <div tri-col [span]="12">
          <a class="login-form-forgot">Forgot password</a>
        </div>
      </div>
      <button tri-button class="login-form-button login-form-margin" [type]="'primary'">Log in</button>
      Or
      <a>register now!</a>
    </form>
  `,
  styles: [
    `
      .login-form {
        max-width: 300px;
      }

      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }
    `
  ]
})
export class TriDemoFormNormalLoginComponent {
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

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
}
