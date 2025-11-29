import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import {
  getParentForNestedData,
  TriTreeViewComponent,
  TriTreeViewModule,
  TriTreeViewNestedDataSource
} from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  key: string;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'parent 1',
    key: '1',
    children: [
      {
        name: 'parent 1-0',
        key: '1-0',
        children: [
          { name: 'leaf', key: '1-0-0' },
          { name: 'leaf', key: '1-0-1' }
        ]
      },
      {
        name: 'parent 1-1',
        key: '1-1',
        children: [{ name: 'leaf', key: '1-1-0' }]
      }
    ]
  },
  {
    key: '2',
    name: 'parent 2',
    children: [{ name: 'leaf', key: '2-0' }]
  }
];

@Component({
  selector: 'tri-demo-tree-view-editable',
  imports: [TriButtonModule, TriInputModule, TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-view [dataSource]="dataSource" [childrenAccessor]="childrenAccessor" [trackBy]="trackBy">
      <tri-tree-node *treeNodeDef="let node" treeNodeIndentLine [expandable]="false">
        <tri-tree-node-option
          [disabled]="node.disabled"
          [selected]="selectListSelection.isSelected(node)"
          (click)="selectListSelection.toggle(node)"
        >
          {{ node.name }}
        </tri-tree-node-option>
        <button tri-button type="text" size="small" (click)="delete(node)">
          <tri-icon type="minus" theme="outline" />
        </button>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasNoContent" treeNodeIndentLine [expandable]="false">
        <input tri-input placeholder="Input node name" size="small" #inputElement />
        &nbsp;
        <button tri-button size="small" (click)="saveNode(node, inputElement.value)">Add</button>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodeIndentLine [expandable]="true">
        <tri-tree-node-toggle>
          <tri-icon type="caret-down" treeNodeToggleRotateIcon />
        </tri-tree-node-toggle>
        {{ node.name }}
        <button tri-button type="text" size="small" (click)="addNewNode(node)">
          <tri-icon type="plus" theme="outline" />
        </button>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriDemoTreeViewEditableComponent implements OnInit, AfterViewInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<TreeNode>;

  readonly childrenAccessor = (dataNode: TreeNode): TreeNode[] => dataNode.children ?? [];

  readonly hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;

  readonly hasNoContent = (_: number, node: TreeNode): boolean => node.name === '';

  readonly trackBy = (_: number, node: TreeNode): string => `${node.key}-${node.name}`;

  selectListSelection = new SelectionModel<TreeNode>(true);

  treeData = TREE_DATA;

  dataSource!: TriTreeViewNestedDataSource<TreeNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewNestedDataSource<TreeNode>(this.tree, this.treeData);
  }

  ngAfterViewInit(): void {
    this.tree.expandAll();
  }

  delete(node: TreeNode): void {
    const parentNode = getParentForNestedData(this.treeData, node, this.childrenAccessor);
    if (parentNode && parentNode.children) {
      parentNode.children = parentNode.children.filter(e => e !== node);
    }

    this.dataSource.setData(this.treeData);
  }
  addNewNode(node: TreeNode): void {
    node.children = node.children || [];
    node.children.push({
      name: '',
      key: `${node.key}-${node.children.length}`
    });
    this.dataSource.setData(this.treeData);
    this.tree.expand(node);
  }

  saveNode(node: TreeNode, value: string): void {
    if (node) {
      node.name = value;
      this.dataSource.setData(this.treeData);
    }
  }
}
