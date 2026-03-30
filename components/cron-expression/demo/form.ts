import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-cron-expression-form',
  imports: [ReactiveFormsModule, TriButtonModule, TriCronExpressionModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form layout="vertical" [formGroup]="form" (ngSubmit)="submit()">
      <tri-form-item>
        <tri-form-label [span]="6">name</tri-form-label>
        <tri-form-control [span]="14">
          <input tri-input formControlName="username" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="6">nz-cron-linux</tri-form-label>
        <tri-form-control [span]="14">
          <tri-cron-expression formControlName="cronLinux" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="6">nz-cron-spring</tri-form-label>
        <tri-form-control [span]="14">
          <tri-cron-expression formControlName="cronSpring" type="spring" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control>
          <button tri-button type="primary" [disabled]="!form.valid">submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoCronExpressionFormComponent {
  private fb = inject(FormBuilder);
  form: FormGroup<{
    username: FormControl<string | null>;
    cronLinux: FormControl<string | null>;
    cronSpring: FormControl<string | null>;
  }> = this.fb.group({
    username: ['cron-expression', [Validators.required]],
    cronLinux: ['* 1 * * *', [Validators.required]],
    cronSpring: ['0 * 1 * * *', [Validators.required]]
  });

  submit(): void {
    console.log(this.form.value);
  }
}
