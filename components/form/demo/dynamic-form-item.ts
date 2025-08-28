import { Component, inject, OnInit } from '@angular/core';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-dynamic-form-item',
  imports: [ReactiveFormsModule, TriButtonModule, TriFormModule, TriIconModule, TriInputModule],
  template: `
    <form tri-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <ng-container formArrayName="names">
        @for (control of listOfControl.controls; track control; let i = $index) {
          <tri-form-item>
            @if (i === 0) {
              <tri-form-label [xs]="24" [sm]="4" [for]="'passenger' + i"> Passengers </tri-form-label>
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
                [attr.id]="'passenger' + i"
                [formControlName]="i"
              />
              @if (listOfControl.controls.length > 1) {
                <tri-icon type="minus-circle-o" class="dynamic-delete-button" (click)="removeField(i, $event)" />
              }
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
            <button tri-button type="dashed" class="add-button" (click)="addHeadField($event)">
              <tri-icon type="plus" />
              Add field at head
            </button>
          </tri-form-control>
        </tri-form-item>
        <tri-form-item>
          <tri-form-control [xs]="{ span: 24, offset: 0 }" [sm]="{ span: 20, offset: 4 }">
            <button tri-button type="primary">Submit</button>
          </tri-form-control>
        </tri-form-item>
      </ng-container>
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
  validateForm = this.fb.group({
    names: this.fb.array([])
  });
  listOfControl = this.validateForm.get('names') as FormArray;

  addField(e?: MouseEvent): void {
    e?.preventDefault();
    this.listOfControl.push(this.fb.control('', Validators.required));
  }

  addHeadField(e?: MouseEvent): void {
    e?.preventDefault();
    this.listOfControl.insert(0, this.fb.control('The head item', Validators.required));
  }

  removeField(index: number, e: MouseEvent): void {
    e.preventDefault();
    this.listOfControl.removeAt(index);
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.listOfControl.controls).forEach(control => {
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
