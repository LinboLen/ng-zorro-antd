import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';

import { TriHighlightPipe } from 'ng-zorro-antd/core/highlight';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriTreeFlatDataSource, TriTreeFlattener, TriTreeViewModule } from 'ng-zorro-antd/tree-view';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const TREE_DATA: TreeNode[] = [
  {
    name: '0-0',
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

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

class FilteredTreeResult {
  constructor(
    public treeData: TreeNode[],
    public needsToExpanded: TreeNode[] = []
  ) {}
}

/**
 * From https://stackoverflow.com/a/45290208/6851836
 */
function filterTreeData(data: TreeNode[], value: string): FilteredTreeResult {
  const needsToExpanded = new Set<TreeNode>();
  const _filter = (node: TreeNode, result: TreeNode[]): TreeNode[] => {
    if (node.name.search(value) !== -1) {
      result.push(node);
      return result;
    }
    if (Array.isArray(node.children)) {
      const nodes = node.children.reduce((a, b) => _filter(b, a), [] as TreeNode[]);
      if (nodes.length) {
        const parentNode = { ...node, children: nodes };
        needsToExpanded.add(parentNode);
        result.push(parentNode);
      }
    }
    return result;
  };
  const treeData = data.reduce((a, b) => _filter(b, a), [] as TreeNode[]);
  return new FilteredTreeResult(treeData, [...needsToExpanded]);
}

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule, TriIconModule, TriTreeViewModule, TriNoAnimationDirective, TriHighlightPipe],
  template: `
    <tri-input-group [suffix]="suffixIcon">
      <input type="text" tri-input placeholder="Search" ngModel (ngModelChange)="searchValue$.next($event)" />
    </tri-input-group>
    <ng-template #suffixIcon>
      <tri-icon type="search" />
    </ng-template>

    <tri-tree-view [treeControl]="treeControl" [dataSource]="dataSource" noAnimation>
      <tri-tree-node *treeNodeDef="let node" treeNodePadding>
        <tri-tree-node-toggle treeNodeNoopToggle></tri-tree-node-toggle>
        <span [innerHTML]="node.name | nzHighlight: searchValue : 'i' : 'highlight'"></span>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodePadding>
        <tri-tree-node-toggle>
          <tri-icon type="caret-down" treeNodeToggleRotateIcon />
        </tri-tree-node-toggle>
        <span [innerHTML]="node.name | nzHighlight: searchValue : 'i' : 'highlight'"></span>
      </tri-tree-node>
    </tri-tree-view>
  `,
  styles: [
    `
      nz-input-group {
        margin-bottom: 8px;
      }

      ::ng-deep .highlight {
        color: #f50;
      }
    `
  ]
})
export class TriDemoTreeViewSearchComponent {
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  expandedNodes: TreeNode[] = [];
  searchValue = '';
  originData$ = new BehaviorSubject(TREE_DATA);
  searchValue$ = new BehaviorSubject<string>('');

  transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name
        ? existingNode
        : {
            expandable: !!node.children && node.children.length > 0,
            name: node.name,
            level
          };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  treeControl = new FlatTreeControl<FlatNode, TreeNode>(
    node => node.level,
    node => node.expandable,
    {
      trackBy: flatNode => this.flatNodeMap.get(flatNode)!
    }
  );

  treeFlattener = new TriTreeFlattener<TreeNode, FlatNode, TreeNode>(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new TriTreeFlatDataSource(this.treeControl, this.treeFlattener);

  filteredData$ = combineLatest([
    this.originData$,
    this.searchValue$.pipe(
      auditTime(300),
      map(value => (this.searchValue = value))
    )
  ]).pipe(map(([data, value]) => (value ? filterTreeData(data, value) : new FilteredTreeResult(data))));

  constructor() {
    this.filteredData$.subscribe(result => {
      this.dataSource.setData(result.treeData);

      const hasSearchValue = !!this.searchValue;
      if (hasSearchValue) {
        if (this.expandedNodes.length === 0) {
          this.expandedNodes = this.treeControl.expansionModel.selected;
          this.treeControl.expansionModel.clear();
        }
        this.treeControl.expansionModel.select(...result.needsToExpanded);
      } else {
        if (this.expandedNodes.length) {
          this.treeControl.expansionModel.clear();
          this.treeControl.expansionModel.select(...this.expandedNodes);
          this.expandedNodes = [];
        }
      }
    });
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
}
