import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import {
  TriTreeFlattener,
  TriTreeViewComponent,
  TriTreeViewFlatDataSource,
  TriTreeViewModule
} from 'ng-zorro-antd/tree-view';

interface FoodNode {
  name: string;
  disabled?: boolean;
  children?: FoodNode[];
}

interface FlatFoodNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana', disabled: true }, { name: 'Fruit loops' }]
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }]
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
      }
    ]
  }
];

@Component({
  selector: 'tri-demo-tree-view-directory',
  imports: [TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-view [dataSource]="dataSource" [levelAccessor]="levelAccessor" [directoryTree]="true">
      <tri-tree-node *treeNodeDef="let node" treeNodePadding [expandable]="false">
        <tri-tree-node-toggle treeNodeNoopToggle />
        <tri-tree-node-option
          [disabled]="node.disabled"
          [selected]="selectListSelection.isSelected(node)"
          (click)="selectListSelection.toggle(node)"
        >
          <tri-icon type="file" theme="outline" />
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
          <tri-icon [type]="tree.isExpanded(node) ? 'folder-open' : 'folder'" theme="outline" />
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriDemoTreeViewDirectoryComponent implements OnInit, AfterViewInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<FlatFoodNode>;

  readonly levelAccessor = (dataNode: FlatFoodNode): number => dataNode.level;

  readonly hasChild = (_: number, node: FlatFoodNode): boolean => node.expandable;

  private transformer = (node: FoodNode, level: number): FlatFoodNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled
  });

  private treeFlattener = new TriTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  selectListSelection = new SelectionModel<FlatFoodNode>(true);

  dataSource!: TriTreeViewFlatDataSource<FoodNode, FlatFoodNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewFlatDataSource(this.tree, this.treeFlattener, TREE_DATA);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tree.expand(this.getNode('Vegetables')!);
    }, 300);
  }

  getNode(name: string): FlatFoodNode | null {
    return this.tree.dataNodes.find(n => n.name === name) || null;
  }
}
