import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-cron-expression-use',
  imports: [ReactiveFormsModule, TriButtonModule, TriCronExpressionModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [layout]="'vertical'" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [span]="6">name</tri-form-label>
        <tri-form-control [span]="14">
          <input tri-input formControlName="username" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="6">nz-cron-linux</tri-form-label>
        <tri-form-control [span]="14">
          <tri-cron-expression formControlName="cronLinux"></tri-cron-expression>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="6">nz-cron-spring</tri-form-label>
        <tri-form-control [span]="14">
          <tri-cron-expression formControlName="cronSpring" type="spring"></tri-cron-expression>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control>
          <button tri-button type="primary" [disabled]="!validateForm.valid">submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoCronExpressionUseComponent {
  private fb = inject(FormBuilder);
  validateForm: FormGroup<{
    username: FormControl<string | null>;
    cronLinux: FormControl<string | null>;
    cronSpring: FormControl<string | null>;
  }> = this.fb.group({
    username: ['cron-expression', [Validators.required]],
    cronLinux: ['* 1 * * *', [Validators.required]],
    cronSpring: ['0 * 1 * * *', [Validators.required]]
  });

  submitForm(): void {
    console.log(this.validateForm.value);
  }
}
