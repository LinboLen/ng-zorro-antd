import { Component } from '@angular/core';

import { TriTreeNodeOptions } from 'ng-zorro-antd/tree';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

function dig(path = '0', level = 3): TriTreeNodeOptions[] {
  const list: TriTreeNodeOptions[] = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: TriTreeNodeOptions = {
      title: key,
      key,
      expanded: true,
      children: [],
      isLeaf: false
    };

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    } else {
      treeNode.isLeaf = true;
    }

    list.push(treeNode);
  }
  return list;
}

@Component({
  selector: 'tri-demo-tree-select-virtual-scroll',
  imports: [TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      [nodes]="nodes"
      showSearch
      placeHolder="Please select"
      virtualHeight="300px"
      hideUnMatched="true"
    />
  `
})
export class TriDemoTreeSelectVirtualScrollComponent {
  nodes: TriTreeNodeOptions[] = dig();
}
