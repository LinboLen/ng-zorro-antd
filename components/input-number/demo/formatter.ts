import { Component, signal } from '@angular/core';
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
  styles: `
    nz-input-number {
      margin-right: 8px;
    }
  `
})
export class TriDemoInputNumberFormatterComponent {
  readonly dollarValue = signal(1000);
  readonly percentValue = signal(100);
  readonly formatterDollar = (value: number): string => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  readonly parserDollar = (value: string): number => +value?.replace(/\$\s?|(,*)/g, '');
  readonly formatterPercent = (value: number): string => `${value}%`;
  readonly parserPercent = (value: string): number => +value?.replace('%', '');
}
