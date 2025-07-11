import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTreeFlatDataSource, TriTreeFlattener, TriTreeViewModule } from 'ng-zorro-antd/tree-view';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

function dig(path: string = '0', level: number = 3): FoodNode[] {
  const list: FoodNode[] = [];
  for (let i = 0; i < 10; i += 1) {
    const name = `${path}-${i}`;
    const treeNode: FoodNode = {
      name
    };

    if (level > 0) {
      treeNode.children = dig(name, level - 1);
    }

    list.push(treeNode);
  }
  return list;
}

const TREE_DATA: FoodNode[] = dig();

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'tri-demo-tree-view-virtual-scroll',
  imports: [TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-virtual-scroll-view class="virtual-scroll-tree" [treeControl]="treeControl" [dataSource]="dataSource">
      <tri-tree-node *treeNodeDef="let node" treeNodePadding>
        <tri-tree-node-toggle treeNodeNoopToggle></tri-tree-node-toggle>
        {{ node.name }}
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodePadding>
        <tri-tree-node-toggle>
          <tri-icon type="caret-down" treeNodeToggleRotateIcon />
        </tri-tree-node-toggle>
        {{ node.name }}
      </tri-tree-node>
    </tri-tree-virtual-scroll-view>
  `,
  styles: [
    `
      .virtual-scroll-tree {
        height: 200px;
      }
    `
  ]
})
export class TriDemoTreeViewVirtualScrollComponent {
  private transformer = (node: FoodNode, level: number): ExampleFlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level
  });

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new TriTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new TriTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.dataSource.setData(TREE_DATA);
    this.treeControl.expandAll();
  }

  hasChild = (_: number, node: ExampleFlatNode): boolean => node.expandable;
}
