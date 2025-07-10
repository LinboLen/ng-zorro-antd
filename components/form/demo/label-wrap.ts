import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" noColon labelAlign="left" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label required for="user" span="3"> Normal text label </tri-form-label>
        <tri-form-control errorTip="Please input your username!" span="8">
          <input formControlName="username" tri-input id="user" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label required for="label-wrap-password" span="3" labelWrap>
          Long text label Long text label
        </tri-form-label>
        <tri-form-control errorTip="Please input your Password!" span="8">
          <input formControlName="password" tri-input type="password" id="label-wrap-password" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control span="12" style="text-align: center">
          <button tri-button type="primary">Log in</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoFormLabelWrapComponent {
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }
}
