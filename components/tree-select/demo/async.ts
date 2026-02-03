import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFormatEmitEvent, TriTreeNodeOptions } from 'ng-zorro-antd/tree';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-async',
  imports: [FormsModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      placeHolder="Please select"
      [expandedKeys]="expandKeys"
      [(ngModel)]="value"
      [dropdownMatchSelectWidth]="true"
      [dropdownStyle]="{ 'max-height': '300px' }"
      [nodes]="nodes"
      [asyncData]="true"
      (expandChange)="onExpandChange($event)"
    />
  `
})
export class TriDemoTreeSelectAsyncComponent {
  expandKeys = ['0-0'];
  value?: string;
  readonly nodes = [
    {
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1',
          key: '0-0-1'
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2'
        }
      ]
    },
    {
      title: 'Node2',
      value: '0-1',
      key: '0-1'
    }
  ];

  onExpandChange(e: TriFormatEmitEvent): void {
    const node = e.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      this.loadNode().then(data => {
        node.addChildren(data);
      });
    }
  }

  loadNode(): Promise<TriTreeNodeOptions[]> {
    return new Promise(resolve => {
      setTimeout(
        () =>
          resolve([
            { title: 'Child Node', key: `${new Date().getTime()}-0` },
            { title: 'Child Node', key: `${new Date().getTime()}-1` }
          ]),
        1000
      );
    });
  }
}
