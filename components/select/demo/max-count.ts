import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

function alphabet(): string[] {
  const children: string[] = [];
  for (let i = 10; i < 36; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}

@Component({
  selector: 'tri-demo-select-max-count',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      [options]="options"
      [maxMultipleCount]="3"
      mode="multiple"
      placeHolder="Please select"
      allowClear
      [(ngModel)]="value"
    />
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectMaxCountComponent {
  readonly options = alphabet().map(item => ({ label: item, value: item }));
  readonly value = signal(['a10', 'c12']);
}
