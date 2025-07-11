import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule, TriSelectSizeType } from 'ng-zorro-antd/select';

function alphabet(): string[] {
  const children: string[] = [];
  for (let i = 10; i < 36; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}

@Component({
  selector: 'tri-demo-select-size',
  imports: [FormsModule, TriSelectModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="size">
      <label tri-radio-button value="large">Large</label>
      <label tri-radio-button value="default">Default</label>
      <label tri-radio-button value="small">Small</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-select [(ngModel)]="singleValue" [size]="size">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
    </tri-select>
    <br />
    <br />
    <tri-select [(ngModel)]="singleValue" [size]="size" showSearch>
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
    </tri-select>
    <br />
    <br />
    <tri-select [(ngModel)]="multipleValue" [size]="size" mode="multiple" placeHolder="Please select">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
    </tri-select>
    <br />
    <br />
    <tri-select [(ngModel)]="tagValue" [size]="size" mode="tags" placeHolder="Please select">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectSizeComponent {
  readonly listOfOption: string[] = alphabet();
  size: TriSelectSizeType = 'default';
  singleValue = 'a10';
  multipleValue = ['a10', 'c12'];
  tagValue = ['a10', 'c12', 'tag'];
}
