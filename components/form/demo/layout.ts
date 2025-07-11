import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormLayoutType, TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-form-layout',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule, TriRadioModule],
  template: `
    <form
      tri-form
      [layout]="validateForm.controls.formLayout.value"
      [formGroup]="validateForm"
      (ngSubmit)="submitForm()"
    >
      <tri-form-item>
        <tri-form-label [span]="isHorizontal ? 4 : null">Form Layout</tri-form-label>
        <tri-form-control [span]="isHorizontal ? 14 : null">
          <tri-radio-group formControlName="formLayout">
            <label tri-radio-button [value]="'horizontal'">Horizontal</label>
            <label tri-radio-button [value]="'vertical'">Vertical</label>
            <label tri-radio-button [value]="'inline'">Inline</label>
          </tri-radio-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="isHorizontal ? 4 : null">Field A</tri-form-label>
        <tri-form-control [span]="isHorizontal ? 14 : null" errorTip="Please input your username!">
          <input tri-input formControlName="fieldA" placeholder="input placeholder" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="isHorizontal ? 4 : null">Field B</tri-form-label>
        <tri-form-control [span]="isHorizontal ? 14 : null" errorTip="Please input your Password!">
          <input tri-input formControlName="filedB" placeholder="input placeholder" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [span]="isHorizontal ? 14 : null" [offset]="isHorizontal ? 4 : null">
          <button tri-button type="primary">Submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `
  ]
})
export class TriDemoFormLayoutComponent {
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    formLayout: this.fb.control<TriFormLayoutType>('horizontal'),
    fieldA: this.fb.control('', [Validators.required]),
    filedB: this.fb.control('', [Validators.required])
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

  get isHorizontal(): boolean {
    return this.validateForm.controls.formLayout.value === 'horizontal';
  }
}
