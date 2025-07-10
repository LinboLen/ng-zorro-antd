import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriButtonModule, TriColorPickerModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [span]="4">name</tri-form-label>
        <tri-form-control [span]="16">
          <input tri-input formControlName="username" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="4">color</tri-form-label>
        <tri-form-control [span]="16">
          <tri-color-picker formControlName="colorPicker" showText></tri-color-picker>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control>
          <button tri-button type="primary">submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoColorPickerUseComponent {
  private formBuilder = inject(FormBuilder);
  validateForm = this.formBuilder.group({
    username: ['color-picker', [Validators.required]],
    colorPicker: ['#1677ff']
  });

  submitForm(): void {
    console.log(this.validateForm.value);
  }
}
