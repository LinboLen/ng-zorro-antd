import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-validate-reactive',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [span]="7" required>Username</tri-form-label>
        <tri-form-control [span]="12" hasFeedback validatingTip="Validating..." [errorTip]="userErrorTpl">
          <input tri-input formControlName="userName" placeholder="async validate try to write JasonWood" />
          <ng-template #userErrorTpl let-control>
            @if (control.errors?.['required']) {
              Please input your username!
            }
            @if (control.errors?.['duplicated']) {
              The username is redundant!
            }
          </ng-template>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>E-mail</tri-form-label>
        <tri-form-control [span]="12" hasFeedback [errorTip]="emailErrorTpl">
          <input tri-input formControlName="email" placeholder="email" type="email" />
          <ng-template #emailErrorTpl let-control>
            @if (control.errors?.['email']) {
              The input is not valid E-mail!
            }
            @if (control.errors?.['required']) {
              Please input your E-mail!
            }
          </ng-template>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>Password</tri-form-label>
        <tri-form-control [span]="12" hasFeedback errorTip="Please input your password!">
          <input tri-input type="password" formControlName="password" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>Confirm Password</tri-form-label>
        <tri-form-control [span]="12" hasFeedback [errorTip]="passwordErrorTpl">
          <input tri-input type="password" formControlName="confirm" placeholder="confirm your password" />
          <ng-template #passwordErrorTpl let-control>
            @if (control.errors?.['required']) {
              Please confirm your password!
            }
            @if (control.errors?.['confirm']) {
              Password is inconsistent!
            }
          </ng-template>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="7" required>Comment</tri-form-label>
        <tri-form-control [span]="12" hasFeedback errorTip="Please write something here!">
          <tri-textarea-count [maxCharacterCount]="2000">
            <textarea formControlName="comment" tri-input rows="2" placeholder="write any thing"></textarea>
          </tri-textarea-count>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [offset]="7" [span]="12">
          <button tri-button type="primary" [disabled]="!validateForm.valid">Submit</button>
          <button tri-button (click)="resetForm($event)">Reset</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: `
    [nz-form] {
      max-width: 600px;
    }

    button {
      margin-left: 8px;
    }
  `
})
export class TriDemoFormValidateReactiveComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    userName: this.fb.control('', [Validators.required], [this.userNameAsyncValidator]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
    confirm: this.fb.control('', [this.confirmValidator]),
    comment: this.fb.control('', [Validators.required])
  });

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm.controls.confirm.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  userNameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
  }

  confirmValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== control.parent!.value.password) {
      return { confirm: true, error: true };
    }
    return {};
  }
}
