import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import {
  getDescendantsForNestedData,
  getParentForNestedData,
  TriTreeViewComponent,
  TriTreeViewModule,
  TriTreeViewNestedDataSource
} from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: '0-0',
    disabled: true,
    children: [{ name: '0-0-0' }, { name: '0-0-1' }, { name: '0-0-2' }]
  },
  {
    name: '0-1',
    children: [
      {
        name: '0-1-0',
        children: [{ name: '0-1-0-0' }, { name: '0-1-0-1' }]
      },
      {
        name: '0-1-1',
        children: [{ name: '0-1-1-0' }, { name: '0-1-1-1' }]
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-tree-view-checkbox',
  imports: [TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-view [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
      <tri-tree-node *treeNodeDef="let node" treeNodePadding [expandable]="false">
        <tri-tree-node-toggle treeNodeNoopToggle></tri-tree-node-toggle>
        <tri-tree-node-checkbox
          [disabled]="node.disabled"
          [checked]="checklistSelection.isSelected(node)"
          (click)="leafItemSelectionToggle(node)"
        ></tri-tree-node-checkbox>
        <tri-tree-node-option [disabled]="node.disabled" (click)="leafItemSelectionToggle(node)">
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodePadding [expandable]="true">
        <tri-tree-node-toggle>
          <tri-icon type="caret-down" treeNodeToggleRotateIcon />
        </tri-tree-node-toggle>
        <tri-tree-node-checkbox
          [disabled]="node.disabled"
          [checked]="descendantsAllSelected(node)"
          [indeterminate]="descendantsPartiallySelected(node)"
          (click)="itemSelectionToggle(node)"
        ></tri-tree-node-checkbox>
        <tri-tree-node-option [disabled]="node.disabled" (click)="itemSelectionToggle(node)">
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriDemoTreeViewCheckboxComponent implements OnInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<TreeNode>;

  readonly childrenAccessor = (dataNode: TreeNode): TreeNode[] => dataNode.children ?? [];

  readonly hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;

  checklistSelection = new SelectionModel<TreeNode>(true);

  dataSource!: TriTreeViewNestedDataSource<TreeNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewNestedDataSource<TreeNode>(this.tree, TREE_DATA);
  }

  private getDescendants(node: TreeNode): TreeNode[] {
    return getDescendantsForNestedData(node, this.childrenAccessor);
  }

  private getParentNode(node: TreeNode): TreeNode | null {
    return getParentForNestedData(this.tree.dataNodes, node, this.childrenAccessor);
  }

  descendantsAllSelected(node: TreeNode): boolean {
    const descendants = this.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: TreeNode): boolean {
    const descendants = this.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: TreeNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: TreeNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: TreeNode): void {
    let parent: TreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: TreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }
}
