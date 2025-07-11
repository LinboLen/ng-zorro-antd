import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormRecord, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-dynamic-form-item',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriIconModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      @for (control of listOfControl; track control; let i = $index) {
        <tri-form-item>
          @if (i === 0) {
            <tri-form-label [xs]="24" [sm]="4" [for]="control.controlInstance"> Passengers </tri-form-label>
          }
          <tri-form-control
            [xs]="24"
            [sm]="20"
            [offset]="i === 0 ? 0 : 4"
            errorTip="Please input passenger's name or delete this field."
          >
            <input
              class="passenger-input"
              tri-input
              placeholder="placeholder"
              [attr.id]="control.id"
              [formControlName]="control.controlInstance"
            />
            <tri-icon type="minus-circle-o" class="dynamic-delete-button" (click)="removeField(control, $event)" />
          </tri-form-control>
        </tri-form-item>
      }

      <tri-form-item>
        <tri-form-control [xs]="{ span: 24, offset: 0 }" [sm]="{ span: 20, offset: 4 }">
          <button tri-button type="dashed" class="add-button" (click)="addField($event)">
            <tri-icon type="plus" />
            Add field
          </button>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-control [xs]="{ span: 24, offset: 0 }" [sm]="{ span: 20, offset: 4 }">
          <button tri-button type="primary">Submit</button>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: [
    `
      .dynamic-delete-button {
        cursor: pointer;
        position: relative;
        top: 4px;
        font-size: 24px;
        color: #999;
        transition: all 0.3s;
      }

      .dynamic-delete-button:hover {
        color: #777;
      }

      .passenger-input {
        width: 60%;
        margin-right: 8px;
      }

      [nz-form] {
        max-width: 600px;
      }

      .add-button {
        width: 60%;
      }
    `
  ]
})
export class TriDemoFormDynamicFormItemComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];

  addField(e?: MouseEvent): void {
    e?.preventDefault();

    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listOfControl.push(control);
    console.log(this.listOfControl[this.listOfControl.length - 1]);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.fb.control('', Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
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

  ngOnInit(): void {
    this.addField();
  }
}
