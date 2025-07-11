import { Component } from '@angular/core';
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
  template: `
    <tri-select
      mode="multiple"
      placeHolder="Please select"
      [options]="listOfOption"
      [(ngModel)]="listOfSelectedValue"
    ></tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectBigDataComponent {
  readonly listOfOption: Array<{ value: string; label: string }> = alphabet(10000).map(item => ({
    label: item,
    value: item
  }));
  listOfSelectedValue = ['a10', 'c12'];
}
