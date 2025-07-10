import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [layout]="'inline'" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-control errorTip="Please input your username!">
          <tri-input-group prefixIcon="user">
            <input formControlName="username" tri-input placeholder="username" />
          </tri-input-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control errorTip="Please input your Password!">
          <tri-input-group prefixIcon="lock">
            <input formControlName="password" tri-input type="password" placeholder="Password" />
          </tri-input-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control>
          <button tri-button type="primary" [disabled]="!validateForm.valid">Log in</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoFormHorizontalLoginComponent {
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
