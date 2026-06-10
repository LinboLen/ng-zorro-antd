import { Component } from '@angular/core';

import { TriSelectModule } from 'ng-zorro-antd/select';

function alphabet(): string[] {
  const children: string[] = [];
  for (let i = 10; i < 36; i++) {
    children.push(i.toString(36) + i);
  }
  return children;
}

@Component({
  selector: 'tri-demo-select-tags',
  imports: [TriSelectModule],
  template: `<tri-select [options]="options" mode="tags" placeHolder="Tag Mode" />`,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectTagsComponent {
  readonly options = alphabet().map(item => ({ label: item, value: item }));
}
