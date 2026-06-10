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
  selector: 'tri-demo-select-multiple',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select
      [options]="options"
      [maxTagCount]="3"
      [maxTagPlaceholder]="tagPlaceHolder"
      mode="multiple"
      allowClear
      placeHolder="Please select"
      [(ngModel)]="value"
    />
    <ng-template #tagPlaceHolder let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectMultipleComponent {
  readonly options = alphabet().map(item => ({ label: item, value: item }));
  readonly value = signal(['a10', 'c12']);
}
