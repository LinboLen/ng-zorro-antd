import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import {
  TriTreeFlattener,
  TriTreeViewComponent,
  TriTreeViewFlatDataSource,
  TriTreeViewModule
} from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  disabled?: boolean;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
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
  selector: 'tri-demo-tree-view-basic-level-accessor',
  template: `
    <tri-tree-view [dataSource]="dataSource" [levelAccessor]="levelAccessor">
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
export class TriDemoTreeViewBasicLevelAccessorComponent implements OnInit, AfterViewInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<FlatNode>;

  readonly levelAccessor = (dataNode: FlatNode): number => dataNode.level;

  readonly hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled
  });

  private treeFlattener = new TriTreeFlattener<TreeNode, FlatNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  selectListSelection = new SelectionModel<FlatNode>(true);

  dataSource!: TriTreeViewFlatDataSource<TreeNode, FlatNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewFlatDataSource(this.tree, this.treeFlattener, TREE_DATA);
  }

  ngAfterViewInit(): void {
    this.tree.expandAll();
  }
}
