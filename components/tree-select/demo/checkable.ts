import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-checkable',
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      [(ngModel)]="value"
      [nodes]="nodes"
      (ngModelChange)="onChange($event)"
      showSearch
      checkable
      placeHolder="Please select"
    />
  `
})
export class TriDemoTreeSelectCheckableComponent {
  value: string[] = ['0-0-0'];
  readonly nodes = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-0',
          key: '0-0-0',
          isLeaf: true
        }
      ]
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
      children: [
        {
          title: 'Child Node3',
          value: '0-1-0',
          key: '0-1-0',
          isLeaf: true
        },
        {
          title: 'Child Node4',
          value: '0-1-1',
          key: '0-1-1',
          isLeaf: true
        },
        {
          title: 'Child Node5',
          value: '0-1-2',
          key: '0-1-2',
          isLeaf: true
        }
      ]
    }
  ];

  onChange($event: string[]): void {
    console.log($event);
  }
}
