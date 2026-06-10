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
  selector: 'tri-demo-select-automatic-tokenization',
  imports: [TriSelectModule],
  template: `
    <tri-select mode="tags" placeHolder="automatic tokenization" [options]="options" [tokenSeparators]="[',']" />
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectAutomaticTokenizationComponent {
  readonly options = alphabet().map(item => ({
    label: item,
    value: item
  }));
}
