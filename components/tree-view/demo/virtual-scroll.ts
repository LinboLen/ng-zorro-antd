import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import {
  TriTreeFlattener,
  TriTreeViewFlatDataSource,
  TriTreeViewModule,
  TriTreeVirtualScrollViewComponent
} from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

function dig(path: string = '0', level: number = 3): TreeNode[] {
  const list: TreeNode[] = [];
  for (let i = 0; i < 10; i += 1) {
    const name = `${path}-${i}`;
    const treeNode: TreeNode = {
      name
    };

    if (level > 0) {
      treeNode.children = dig(name, level - 1);
    }

    list.push(treeNode);
  }
  return list;
}

const TREE_DATA: TreeNode[] = dig();

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'tri-demo-tree-view-virtual-scroll',
  imports: [TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-virtual-scroll-view
      class="virtual-scroll-tree"
      [dataSource]="dataSource"
      [levelAccessor]="levelAccessor"
    >
      <tri-tree-node *treeNodeDef="let node" treeNodePadding [expandable]="false">
        <tri-tree-node-toggle treeNodeNoopToggle></tri-tree-node-toggle>
        {{ node.name }}
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodePadding [expandable]="true">
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
export class TriDemoTreeViewVirtualScrollComponent implements OnInit, AfterViewInit {
  @ViewChild(TriTreeVirtualScrollViewComponent, { static: true }) tree!: TriTreeVirtualScrollViewComponent<FlatNode>;

  readonly levelAccessor = (dataNode: FlatNode): number => dataNode.level;

  readonly hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level
  });

  treeFlattener = new TriTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource!: TriTreeViewFlatDataSource<TreeNode, FlatNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewFlatDataSource(this.tree, this.treeFlattener, TREE_DATA);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tree.expandAll();
    });
  }
}
