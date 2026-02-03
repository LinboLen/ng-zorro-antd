import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTreeViewComponent, TriTreeViewModule, TriTreeViewNestedDataSource } from 'ng-zorro-antd/tree-view';

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

@Component({
  selector: 'tri-demo-tree-view-line',
  imports: [FormsModule, TriIconModule, TriSwitchModule, TriTreeViewModule],
  template: `
    Show Leaf Icon:
    <tri-switch [(ngModel)]="showLeafIcon" />

    <tri-tree-view [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
      <tri-tree-node *treeNodeDef="let node" treeNodeIndentLine [expandable]="false">
        @if (showLeafIcon) {
          <tri-tree-node-toggle treeNodeNoopToggle>
            <tri-icon type="file" theme="outline" />
          </tri-tree-node-toggle>
        }
        <tri-tree-node-option>
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodeIndentLine [expandable]="true">
        <tri-tree-node-toggle>
          <tri-icon [type]="tree.isExpanded(node) ? 'minus-square' : 'plus-square'" theme="outline" />
        </tri-tree-node-toggle>
        <tri-tree-node-option>
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriDemoTreeViewLineComponent implements AfterViewInit, OnInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<TreeNode>;

  readonly childrenAccessor = (dataNode: TreeNode): TreeNode[] => dataNode.children ?? [];

  readonly hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;

  showLeafIcon = false;

  dataSource!: TriTreeViewNestedDataSource<TreeNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewNestedDataSource<TreeNode>(this.tree, TREE_DATA);
  }

  ngAfterViewInit(): void {
    this.tree.expandAll();
  }
}
