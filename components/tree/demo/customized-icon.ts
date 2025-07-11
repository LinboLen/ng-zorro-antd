import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: 'tri-demo-tree-customized-icon',
  imports: [TriIconModule, TriTreeModule],
  template: `
    <tri-tree [data]="nodes" showIcon></tri-tree>
    <tri-tree [data]="nodes" showIcon [expandedIcon]="multiExpandedIconTpl">
      <ng-template #multiExpandedIconTpl let-node let-origin="origin">
        @if (!origin.isLeaf) {
          <tri-icon [type]="node.isExpanded ? 'folder-open' : 'folder'" class="tri-tree-switcher-line-icon" />
        } @else {
          <tri-icon type="file" class="tri-tree-switcher-line-icon" />
        }
      </ng-template>
    </tri-tree>
  `
})
export class TriDemoTreeCustomizedIconComponent {
  readonly nodes = [
    {
      title: 'parent 1',
      key: '100',
      expanded: true,
      icon: 'smile',
      children: [
        { title: 'leaf', key: '1001', icon: 'meh', isLeaf: true },
        { title: 'leaf', key: '1002', icon: 'frown', isLeaf: true }
      ]
    }
  ];
}
