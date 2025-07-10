import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: '',
  imports: [FormsModule, TriInputNumberLegacyModule],
  template: `
    <tri-input-number [(ngModel)]="toFixedValue" [precision]="precision" placeHolder="toFixed"></tri-input-number>
    <tri-input-number
      [(ngModel)]="cutValue"
      [precision]="precision"
      precisionMode="cut"
      placeHolder="cut off"
    ></tri-input-number>
    <tri-input-number
      [(ngModel)]="customFnValue"
      [precision]="precision"
      [precisionMode]="customPrecisionFn"
      placeHolder="cut off"
    ></tri-input-number>
  `,
  styles: [
    `
      nz-input-number {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoInputNumberLegacyPrecisionComponent {
  toFixedValue = 2;
  cutValue = 2;
  customFnValue = 2;
  precision = 2;
  customPrecisionFn(value: string | number, precision?: number): number {
    return +Number(value).toFixed(precision! + 1);
  }
}
