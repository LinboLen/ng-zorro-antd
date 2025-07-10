import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label required labelAlign="left" span="4">Left-aligned text label</tri-form-label>
        <tri-form-control errorTip="Please input your username!" span="8">
          <input formControlName="username" tri-input placeholder="username" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label required labelAlign="right" span="4">Right-aligned text label</tri-form-label>
        <tri-form-control errorTip="Please input your Password!" span="8">
          <input formControlName="password" tri-input type="password" placeholder="Password" />
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoFormLabelAlignComponent {
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
