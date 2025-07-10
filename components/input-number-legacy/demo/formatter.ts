import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';

@Component({
  selector: '',
  imports: [FormsModule, TriInputNumberLegacyModule],
  template: `
    <tri-input-number
      [(ngModel)]="demoValue"
      [min]="1"
      [max]="100"
      [step]="1"
      [formatter]="formatterDollar"
      [parser]="parserDollar"
    ></tri-input-number>
    <tri-input-number
      [(ngModel)]="demoValue"
      [min]="1"
      [max]="100"
      [step]="1"
      [formatter]="formatterPercent"
      [parser]="parserPercent"
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
export class TriDemoInputNumberLegacyFormatterComponent {
  demoValue = 100;
  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');
  formatterDollar = (value: number): string => `$ ${value}`;
  parserDollar = (value: string): string => value.replace('$ ', '');
}
