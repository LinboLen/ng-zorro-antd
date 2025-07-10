import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriButtonModule, TriCheckboxModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [span]="4" required for="name">Name</tri-form-label>
        <tri-form-control [span]="8" errorTip="Please input your name">
          <input type="text" tri-input formControlName="name" placeholder="Please input your name" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="4" for="nickname" [required]="validateForm.controls.required.value">
          Nickname
        </tri-form-label>
        <tri-form-control [span]="8" errorTip="Please input your nickname">
          <input type="text" tri-input formControlName="nickname" placeholder="Please input your nickname" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [span]="8" [offset]="4">
          <label tri-checkbox formControlName="required">Nickname is required</label>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [span]="8" [offset]="4">
          <button tri-button type="primary">Check</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoFormDynamicRuleComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    nickname: this.fb.control(''),
    required: this.fb.control(false)
  });

  ngOnInit(): void {
    this.validateForm.controls.required.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.requiredChange(value);
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

  requiredChange(required: boolean): void {
    if (!required) {
      this.validateForm.controls.nickname.clearValidators();
      this.validateForm.controls.nickname.markAsPristine();
    } else {
      this.validateForm.controls.nickname.setValidators(Validators.required);
      this.validateForm.controls.nickname.markAsDirty();
    }
    this.validateForm.controls.nickname.updateValueAndValidity();
  }
}
