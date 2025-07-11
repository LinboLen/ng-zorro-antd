import { Component } from '@angular/core';

import { TriCheckListModule, TriItemProps } from 'ng-zorro-antd/check-list';

@Component({
  selector: 'tri-demo-check-list-basic',
  imports: [TriCheckListModule],
  template: `<tri-check-list [items]="items" [index]="index"></tri-check-list>`
})
export class TriDemoCheckListBasicComponent {
  index = 1;
  readonly items: TriItemProps[] = [
    {
      description: 'step 1',
      onClick: () => this.index++
    },
    {
      description: 'step 2',
      onClick: () => this.index++
    },
    {
      description: 'step 3',
      onClick: () => this.index++
    },
    {
      description: 'step 4',
      onClick: () => this.index++
    }
  ];
}
