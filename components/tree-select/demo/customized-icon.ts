import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-customized-icon',
  imports: [FormsModule, TriIconModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      [(ngModel)]="value"
      [nodes]="nodes"
      placeHolder="Please select"
      showIcon
    />
    <br />
    <tri-tree-select
      style="width: 250px; margin-top: 20px;"
      [(ngModel)]="value"
      [nodes]="nodes"
      placeHolder="Please select"
    >
      <ng-template #nzTreeTemplate let-node>
        <span class="tri-tree-node-content-wrapper" [class.tri-tree-node-selected]="node.isSelected">
          <span>
            <tri-icon [type]="node.isExpanded ? 'folder-open' : 'folder'" />
            {{ node.title }}
          </span>
        </span>
      </ng-template>
    </tri-tree-select>
  `
})
export class TriDemoTreeSelectCustomizedIconComponent {
  value?: string;
  readonly nodes = [
    {
      title: 'parent 1',
      key: '100',
      expanded: true,
      icon: 'smile',
      children: [
        { title: 'leaf 1-0-0', key: '10010', icon: 'meh', isLeaf: true },
        { title: 'leaf 1-0-1', key: '10011', icon: 'frown', isLeaf: true }
      ]
    }
  ];
}
