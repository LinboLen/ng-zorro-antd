import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';

import { CronExpressionParser } from 'cron-parser';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

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
        <tri-form-label [span]="6">minimum interval: 1 day</tri-form-label>
        <tri-form-control [span]="14">
          <tri-cron-expression
            formControlName="cronMinInterval"
            [semantic]="form.controls.cronMinInterval.hasError('minInterval') ? minIntervalError : null"
          />
          <ng-template #minIntervalError>
            <span class="tri-cron-expression-error">The interval cannot be less than 1 day.</span>
          </ng-template>
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
  private readonly fb = inject(FormBuilder);
  private readonly minIntervalValidator: ValidatorFn = control => {
    if (typeof control.value !== 'string' || !control.value) {
      return null;
    }

    try {
      const interval = CronExpressionParser.parse(control.value);
      const firstExecution = interval.next().toDate();
      const secondExecution = interval.next().toDate();
      return secondExecution.getTime() - firstExecution.getTime() < ONE_DAY_IN_MILLISECONDS
        ? { minInterval: true }
        : null;
    } catch {
      return null;
    }
  };

  readonly form: FormGroup<{
    username: FormControl<string | null>;
    cronLinux: FormControl<string | null>;
    cronMinInterval: FormControl<string | null>;
    cronSpring: FormControl<string | null>;
  }> = this.fb.group({
    username: ['cron-expression', [Validators.required]],
    cronLinux: ['* 1 * * *', [Validators.required]],
    cronSpring: ['0 * 1 * * *', [Validators.required]],
    cronMinInterval: ['0 */12 * * *', [Validators.required, this.minIntervalValidator]]
  });

  constructor() {
    this.form.controls.cronMinInterval.markAsTouched();
  }

  submit(): void {
    console.log(this.form.value);
  }
}
