import { Component } from '@angular/core';

import { TriCheckListModule, TriItemProps } from 'ng-zorro-antd/check-list';

@Component({
  selector: 'tri-demo-check-list-basic',
  imports: [TriCheckListModule],
  template: `<tri-check-list [items]="items" [index]="index" />`
})
export class TriDemoCheckListBasicComponent {
  index = 2;
  readonly items: TriItemProps[] = [
    {
      description: 'step 1',
      checked: true,
      onClick: (item: TriItemProps) => {
        this.index++;
        item.checked = true;
      }
    },
    {
      description: 'step 2',
      onClick: (item: TriItemProps) => {
        this.index++;
        item.checked = true;
      }
    },
    {
      description: 'step 3',
      onClick: (item: TriItemProps) => {
        this.index++;
        item.checked = true;
      }
    },
    {
      description: 'step 4',
      onClick: (item: TriItemProps) => {
        this.index++;
        item.checked = true;
      }
    }
  ];
}
