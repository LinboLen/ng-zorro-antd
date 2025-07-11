import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';

@Component({
  selector: 'tri-demo-input-number-formatter',
  imports: [FormsModule, TriInputNumberModule],
  template: `
    <tri-input-number [(ngModel)]="dollarValue" [formatter]="formatterDollar" [parser]="parserDollar" />
    <tri-input-number
      [(ngModel)]="percentValue"
      min="1"
      max="100"
      [formatter]="formatterPercent"
      [parser]="parserPercent"
    />
  `,
  styles: [
    `
      nz-input-number {
        margin-right: 8px;
      }
    `
  ]
})
export class TriDemoInputNumberFormatterComponent {
  dollarValue = 1000;
  percentValue = 100;
  formatterDollar = (value: number): string => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parserDollar = (value: string): number => parseFloat(value?.replace(/\$\s?|(,*)/g, ''));
  formatterPercent = (value: number): string => `${value}%`;
  parserPercent = (value: string): number => parseFloat(value?.replace('%', ''));
}
