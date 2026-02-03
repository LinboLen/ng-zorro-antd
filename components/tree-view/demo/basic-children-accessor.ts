import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTreeViewComponent, TriTreeViewModule, TriTreeViewNestedDataSource } from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'parent 1',
    children: [
      {
        name: 'parent 1-0',
        disabled: true,
        children: [{ name: 'leaf' }, { name: 'leaf' }]
      },
      {
        name: 'parent 1-1',
        children: [{ name: 'leaf' }]
      }
    ]
  }
];

@Component({
  imports: [TriIconModule, TriTreeViewModule],
  selector: 'tri-demo-tree-view-basic-children-accessor',
  template: `
    <tri-tree-view [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
      <tri-tree-node *treeNodeDef="let node" treeNodePadding [expandable]="false">
        <tri-tree-node-toggle treeNodeNoopToggle />
        <tri-tree-node-option
          [disabled]="node.disabled"
          [selected]="selectListSelection.isSelected(node)"
          (click)="selectListSelection.toggle(node)"
        >
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodePadding [expandable]="true">
        <tri-tree-node-toggle>
          <tri-icon type="caret-down" treeNodeToggleRotateIcon />
        </tri-tree-node-toggle>
        <tri-tree-node-option
          [disabled]="node.disabled"
          [selected]="selectListSelection.isSelected(node)"
          (click)="selectListSelection.toggle(node)"
        >
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriDemoTreeViewBasicChildrenAccessorComponent implements OnInit, AfterViewInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<TreeNode>;

  readonly childrenAccessor = (dataNode: TreeNode): TreeNode[] => dataNode.children ?? [];

  readonly hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;

  selectListSelection = new SelectionModel<TreeNode>(true);

  dataSource!: TriTreeViewNestedDataSource<TreeNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewNestedDataSource<TreeNode>(this.tree, TREE_DATA);
  }

  ngAfterViewInit(): void {
    this.tree.expandAll();
  }
}
