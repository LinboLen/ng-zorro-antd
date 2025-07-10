import { Component, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriMentionComponent, TriMentionModule } from 'ng-zorro-antd/mention';

@Component({
  selector: '',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriInputModule, TriMentionModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <tri-form-item>
        <tri-form-label [sm]="6" for="mention">Top coders</tri-form-label>
        <tri-form-control [sm]="16" errorTip="More than one must be selected!">
          <tri-mention #mentions [suggestions]="suggestions">
            <textarea
              rows="1"
              id="mention"
              placeholder="input here"
              formControlName="mention"
              mentionTrigger
              tri-input
            ></textarea>
          </tri-mention>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item tri-row style="margin-bottom:8px;">
        <tri-form-control [span]="14" [offset]="6">
          <div class="cta-wrapper">
            <button type="button" tri-button type="primary" (click)="submitForm()">Submit</button>
            <button type="button" tri-button (click)="resetForm()">Reset</button>
          </div>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: [
    `
      .cta-wrapper {
        display: flex;
        gap: 1rem;
      }
    `
  ]
})
export class TriDemoMentionFormComponent {
  readonly suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご', 'ParsaArvaneh'];
  @ViewChild('mentions', { static: true }) mentionChild!: TriMentionComponent;

  mentionValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    if (!control.value) {
      return { required: true };
    } else if (this.mentionChild?.getMentions().length < 2) {
      return { confirm: true, error: true };
    }
    return {};
  };

  private fb = inject(FormBuilder);
  validateForm = this.fb.group({
    mention: ['@afc163 ', [Validators.required, this.mentionValidator]]
  });

  get mention(): FormControl<string | null> {
    return this.validateForm.controls.mention;
  }

  submitForm(): void {
    this.mention.markAsDirty();
    this.mention.updateValueAndValidity();
    if (this.mention.valid) {
      console.log('Submit!!!', this.mention.value);
      console.log(this.mentionChild.getMentions());
    } else {
      console.log('Errors in form!!!');
    }
  }

  resetForm(): void {
    this.validateForm.reset({
      mention: '@afc163 '
    });
  }
}
