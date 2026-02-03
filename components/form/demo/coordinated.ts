import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

type Gender = 'male' | 'female';

@Component({
  selector: 'tri-demo-form-coordinated',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule, TriSelectModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [span]="5" required for="note">Note</tri-form-label>
        <tri-form-control [span]="12" errorTip="Please input your username!">
          <input id="note" type="text" tri-input formControlName="note" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5" for="gender" required>Gender</tri-form-label>
        <tri-form-control [span]="12" errorTip="Please select your gender!">
          <tri-select id="gender" formControlName="gender" placeHolder="Select a option and change input text above">
            <tri-option value="male" label="male" />
            <tri-option value="female" label="female" />
          </tri-select>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [span]="12" [offset]="5">
          <button tri-button type="primary">Submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: `
    [nz-form] {
      max-width: 600px;
    }
  `
})
export class TriDemoFormCoordinatedComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    note: this.fb.control<string | null>(null, Validators.required),
    gender: this.fb.control<Gender | null>(null, Validators.required)
  });

  ngOnInit(): void {
    this.validateForm.controls.gender.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.genderChange(value);
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

  genderChange(value: Gender | null): void {
    this.validateForm.controls.note.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }
}
