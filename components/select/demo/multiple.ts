import { Component } from '@angular/core';
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
  selector: 'tri-demo-select-multiple',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      [maxTagCount]="3"
      [maxTagPlaceholder]="tagPlaceHolder"
      mode="multiple"
      allowClear
      placeHolder="Please select"
      [(ngModel)]="listOfSelectedValue"
    >
      @for (item of listOfOption; track item) {
        <tri-option [label]="item" [value]="item"></tri-option>
      }
    </tri-select>
    <ng-template #tagPlaceHolder let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectMultipleComponent {
  readonly listOfOption: string[] = alphabet();
  listOfSelectedValue = ['a10', 'c12'];
}
