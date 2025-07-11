import { Component } from '@angular/core';

import { TriTreeModule, TriTreeNodeOptions } from 'ng-zorro-antd/tree';

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
  selector: 'tri-demo-tree-virtual-scroll',
  imports: [TriTreeModule],
  template: `<tri-tree [data]="nodes" blockNode virtualHeight="300px"></tri-tree>`
})
export class TriDemoTreeVirtualScrollComponent {
  nodes: TriTreeNodeOptions[] = dig();
}
