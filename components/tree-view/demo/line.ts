import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTreeFlatDataSource, TriTreeFlattener, TriTreeViewModule } from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'parent 1',
    children: [
      {
        name: 'parent 1-0',
        children: [{ name: 'leaf' }, { name: 'leaf' }]
      },
      {
        name: 'parent 1-1',
        children: [
          { name: 'leaf' },
          {
            name: 'parent 1-1-0',
            children: [{ name: 'leaf' }, { name: 'leaf' }]
          },
          { name: 'leaf' }
        ]
      }
    ]
  },
  {
    name: 'parent 2',
    children: [{ name: 'leaf' }, { name: 'leaf' }]
  }
];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: '',
  imports: [FormsModule, TriIconModule, TriSwitchModule, TriTreeViewModule],
  template: `
    Show Leaf Icon:
    <tri-switch [(ngModel)]="showLeafIcon"></tri-switch>

    <tri-tree-view [treeControl]="treeControl" [dataSource]="dataSource">
      <tri-tree-node *treeNodeDef="let node" treeNodeIndentLine>
        @if (showLeafIcon) {
          <tri-tree-node-toggle treeNodeNoopToggle>
            <tri-icon type="file" theme="outline" />
          </tri-tree-node-toggle>
        }
        <tri-tree-node-option>
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodeIndentLine>
        <tri-tree-node-toggle>
          <tri-icon [type]="treeControl.isExpanded(node) ? 'minus-square' : 'plus-square'" theme="outline" />
        </tri-tree-node-toggle>
        <tri-tree-node-option>
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriDemoTreeViewLineComponent implements AfterViewInit {
  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level
  });

  treeControl = new FlatTreeControl<FlatNode>(
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

  showLeafIcon = false;

  constructor() {
    this.dataSource.setData(TREE_DATA);
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  ngAfterViewInit(): void {
    this.treeControl.expandAll();
  }
}
