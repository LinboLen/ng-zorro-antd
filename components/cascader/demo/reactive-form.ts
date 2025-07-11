import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';

const options: TriCascaderOption[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            isLeaf: true
          }
        ]
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        isLeaf: true
      }
    ]
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            isLeaf: true
          }
        ]
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-cascader-reactive-form',
  imports: [ReactiveFormsModule, TriButtonModule, TriCascaderModule],
  template: `
    <form [formGroup]="form" novalidate>
      <tri-cascader [options]="options" formControlName="name"></tri-cascader>
    </form>
    <br />
    <button tri-button (click)="reset()">Reset</button>
    <button tri-button (click)="submit()">Submit</button>
  `,
  styles: [
    `
      button {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoCascaderReactiveFormComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: this.fb.control<string[] | null>(null, Validators.required)
  });
  options: TriCascaderOption[] = options;
  changeSubscription: Subscription;

  constructor() {
    this.changeSubscription = this.form.controls.name.valueChanges.subscribe(data => {
      this.onChanges(data);
    });
  }

  reset(): void {
    this.form.reset();
    console.log(this.form.value);
  }

  submit(): void {
    console.log(this.form.value);
  }

  onChanges(values: string[] | null): void {
    console.log(values);
  }

  ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
  }
}
