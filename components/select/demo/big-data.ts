import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

function alphabet(size: number): string[] {
  const children: string[] = [];
  for (let i = 10; i < size; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}

@Component({
  selector: 'tri-demo-select-big-data',
  imports: [FormsModule, TriSelectModule],
  template: `<tri-select mode="multiple" placeHolder="Please select" [options]="options" [(ngModel)]="value" />`,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectBigDataComponent {
  readonly options = alphabet(10000).map(item => ({
    label: item,
    value: item
  }));
  readonly value = signal(['a10', 'c12']);
}
