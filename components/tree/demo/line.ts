import { Component } from '@angular/core';

import { TriFormatEmitEvent, TriTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: '',
  imports: [TriTreeModule],
  template: `<tri-tree [data]="nodes" showLine (click)="event($event)"></tri-tree>`
})
export class TriDemoTreeLineComponent {
  readonly nodes = [
    {
      title: 'parent 1',
      key: '100',
      expanded: true,
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          expanded: true,
          children: [
            { title: 'leaf', key: '10010', isLeaf: true },
            { title: 'leaf', key: '10011', isLeaf: true },
            { title: 'leaf', key: '10012', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf', key: '10020', isLeaf: true }]
        },
        {
          title: 'parent 1-2',
          key: '1003',
          children: [
            { title: 'leaf', key: '10030', isLeaf: true },
            { title: 'leaf', key: '10031', isLeaf: true }
          ]
        }
      ]
    }
  ];

  event(event: TriFormatEmitEvent): void {
    console.log(event);
  }
}
