/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { cloneDeep } from 'lodash';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriTreeNodeIndentLineDirective } from './indent';
import { TriTreeViewNestedDataSource } from './nested-data-source';
import { TriTreeNodeComponent } from './node';
import { TriTreeNodePaddingDirective } from './padding';
import { TriTreeViewComponent } from './tree-view';
import { TriTreeViewModule } from './tree-view.module';

/**
 * Helper function to wait for the next animation frame in zoneless Angular environment
 */
export async function waitForNextAnimationFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

describe('tree-view based on nzChildrenAccessor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNoopAnimations()]
    });
  });

  describe('tree view basic', () => {
    let fixture: ComponentFixture<TriTestTreeViewBasicWithChildrenAccessorComponent>;
    let testComponent: TriTestTreeViewBasicWithChildrenAccessorComponent;
    let nativeElement: Element;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestTreeViewBasicWithChildrenAccessorComponent);
      testComponent = fixture.componentInstance;
      nativeElement = fixture.debugElement.nativeElement;
      await fixture.whenStable();
    });

    it('should init nested tree data', () => {
      const { dataNodes } = testComponent.tree;
      const shownNodes = nativeElement.querySelectorAll('nz-tree-node:not([builtin])');
      expect(dataNodes.length).toBe(2);
      expect(dataNodes).toEqual(TREE_DATA);
      expect(shownNodes.length).toBe(2);
    });

    it('should highlight when tree node option is selected', async () => {
      const nodeOption = fixture.debugElement.query(By.css('nz-tree-node-option'));
      nodeOption.nativeElement.click();
      await fixture.whenStable();
      expect(nodeOption.nativeElement.classList).toContain('ant-tree-node-selected');
    });

    it('should expand nodes when toggle the collapsed tree node', async () => {
      const nodeToggle = fixture.debugElement.query(By.css('nz-tree-node-toggle'));
      nodeToggle.nativeElement.click();
      await fixture.whenStable();
      expect(nodeToggle.nativeElement.classList).toContain('ant-tree-switcher_open');
      expect(nativeElement.querySelectorAll('nz-tree-node:not([builtin])').length).toBe(4);
    });

    it('should collapse nodes when toggle the expanded tree node', async () => {
      const firstNode = testComponent.tree.dataNodes[0];
      testComponent.tree.expand(firstNode);
      await fixture.whenStable();
      const nodeToggle = fixture.debugElement.query(By.css('nz-tree-node-toggle'));
      nodeToggle.nativeElement.click();
      await fixture.whenStable();
      expect(nodeToggle.nativeElement.classList).toContain('ant-tree-switcher_close');
      expect(nativeElement.querySelectorAll('nz-tree-node:not([builtin])').length).toBe(2);
    });

    it('should disabled node can not be selected but can be expanded', async () => {
      const firstNode = testComponent.tree.dataNodes[0];
      testComponent.tree.expand(firstNode);
      await fixture.whenStable();
      expect(nativeElement.querySelectorAll('nz-tree-node:not([builtin])').length).toBe(4);
      const disabledNode = fixture.debugElement.queryAll(By.css('nz-tree-node:not([builtin])'))[1];
      expect((disabledNode.componentInstance as TriTreeNodeComponent<TreeNode>).data.name).toBe('parent 1-1');
      const disabledNodeOption = disabledNode.query(By.css('nz-tree-node-option'));
      const disabledNodeToggle = disabledNode.query(By.css('nz-tree-node-toggle'));
      disabledNodeOption.nativeElement.click();
      await fixture.whenStable();
      expect(disabledNodeOption.nativeElement.classList).not.toContain('ant-tree-node-selected');
      disabledNodeToggle.nativeElement.click();
      await fixture.whenStable();
      expect(disabledNodeToggle.nativeElement.classList).toContain('ant-tree-switcher_open');
      expect(nativeElement.querySelectorAll('nz-tree-node:not([builtin])').length).toBe(6);
    });

    it('should nzDirectoryTree work', async () => {
      const treeView = fixture.debugElement.query(By.css('nz-tree-view'));
      expect(treeView.nativeElement.classList).not.toContain('ant-tree-directory');
      testComponent.directoryTree = true;
      fixture.changeDetectorRef.markForCheck();
      await fixture.whenStable();
      expect(treeView.nativeElement.classList).toContain('ant-tree-directory');
      expect(treeView.nativeElement.classList).toContain('ant-tree-block-node');
    });

    it('should nzBlockNode work', async () => {
      const treeView = fixture.debugElement.query(By.css('nz-tree-view'));
      expect(treeView.nativeElement.classList).not.toContain('ant-tree-block-node');
      testComponent.blockNode = true;
      fixture.changeDetectorRef.markForCheck();
      await fixture.whenStable();
      expect(treeView.nativeElement.classList).toContain('ant-tree-block-node');
    });
  });

  describe('nested data source', () => {
    let fixture: ComponentFixture<TriTestTreeViewBasicWithChildrenAccessorComponent>;
    let testComponent: TriTestTreeViewBasicWithChildrenAccessorComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestTreeViewBasicWithChildrenAccessorComponent);
      testComponent = fixture.componentInstance;
      await fixture.whenStable();
    });

    it('should dataSource getData return origin nested data', () => {
      const data = testComponent.dataSource.getData();
      expect(data).toBe(TREE_DATA);
    });

    it('should dataSource connect emit origin nested data when tree expansion model changed or data changed', async () => {
      let data: TreeNode[] = [];
      const { dataSource } = testComponent;
      const dataNodes = dataSource.getData();
      dataSource
        .connect(testComponent.tree)
        .pipe()
        .subscribe((value: TreeNode[]) => {
          data = value;
        });
      // expand or collapse
      testComponent.tree.expand(dataNodes[0]);
      await fixture.whenStable();
      expect(data).toEqual(TREE_DATA);
      const firstNodeToggle = fixture.debugElement.query(By.css('nz-tree-node-toggle'));
      firstNodeToggle.nativeElement.click();
      await fixture.whenStable();
      expect(data).toEqual(TREE_DATA);

      // set new data
      const newTreeData = cloneDeep(TREE_DATA).slice(0, 1);
      testComponent.setData(newTreeData);
      expect(testComponent.tree.dataNodes).toBe(newTreeData);
      await fixture.whenStable();
      expect(data).toEqual(newTreeData);
    });
  });

  describe('padding', () => {
    let fixture: ComponentFixture<TriTestTreeViewBasicWithChildrenAccessorComponent>;
    let testComponent: TriTestTreeViewBasicWithChildrenAccessorComponent;
    const defaultIndent = 24;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestTreeViewBasicWithChildrenAccessorComponent);
      testComponent = fixture.componentInstance;
      await fixture.whenStable();
      // expand all node
      const { tree } = testComponent;
      tree.expandAll();
      await fixture.whenStable();
    });

    it('should nzTreeNodePadding without value work', () => {
      const nodes = fixture.debugElement.queryAll(By.css('nz-tree-node:not([builtin])'));
      expect(nodes.length).toBe(8);
      nodes.forEach(node => {
        expect(window.getComputedStyle(node.nativeElement).paddingLeft).toBe(
          `${(node.componentInstance as TriTreeNodeComponent<TreeNode>).level * defaultIndent}px`
        );
      });
    });

    it('should nzTreeNodePadding with value work', async () => {
      const nodes = fixture.debugElement.queryAll(By.directive(TriTreeNodePaddingDirective));
      expect(nodes.length).toBe(8);
      const [parent_1, ...otherNodes] = nodes;
      const parent_1_paddingDir = parent_1.injector.get(TriTreeNodePaddingDirective);
      parent_1_paddingDir.level = 1;
      await fixture.whenStable();
      // 1 * defaultIndent = 24
      expect(window.getComputedStyle(parent_1.nativeElement).paddingLeft).toBe('24px');
      otherNodes.forEach(node => {
        expect(window.getComputedStyle(node.nativeElement).paddingLeft).toBe(
          `${(node.componentInstance as TriTreeNodeComponent<TreeNode>).level * defaultIndent}px`
        );
      });
    });

    it('should nzTreeNodePaddingIndent work', async () => {
      const indent = 50;
      const nodes = fixture.debugElement.queryAll(By.directive(TriTreeNodePaddingDirective));
      expect(nodes.length).toBe(8);
      nodes.forEach(node => {
        const node_paddingDir = node.injector.get(TriTreeNodePaddingDirective);
        node_paddingDir.indent = indent;
      });
      await fixture.whenStable();
      nodes.forEach(node => {
        expect(window.getComputedStyle(node.nativeElement).paddingLeft).toBe(
          `${(node.componentInstance as TriTreeNodeComponent<TreeNode>).level * indent}px`
        );
      });
    });
  });

  describe('line indents', () => {
    let fixture: ComponentFixture<TriTestTreeViewLineComponent>;
    let testComponent: TriTestTreeViewLineComponent;

    beforeEach(async () => {
      fixture = TestBed.createComponent(TriTestTreeViewLineComponent);
      testComponent = fixture.componentInstance;
      await fixture.whenStable();
      // expand all node
      const { tree } = testComponent;
      tree.expandAll();
      await waitForNextAnimationFrame();
      await fixture.whenStable();
    });

    it('should nzTreeNodeIndentLine work', () => {
      const nodes = fixture.debugElement.queryAll(By.directive(TriTreeNodeIndentLineDirective));
      expect(nodes.length).toBe(8);
      const [parent_1, parent_1_1, leaf_1_1_1, leaf_1_1_2, parent_1_2, leaf_1_2_1, parent_2, leaf_2_1] = nodes.map(
        node => node.componentInstance as TriTreeNodeComponent<TreeNode>
      );
      expect(parent_1.indents()).toEqual([]);
      expect(parent_1_1.indents()).toEqual([true]);
      expect(leaf_1_1_1.indents()).toEqual([true, true]);
      expect(leaf_1_1_2.indents()).toEqual([true, true]);
      expect(parent_1_2.indents()).toEqual([true]);
      expect(leaf_1_2_1.indents()).toEqual([true, false]);
      expect(parent_2.indents()).toEqual([]);
      expect(leaf_2_1.indents()).toEqual([false]);
    });
  });
});

interface TreeNode {
  name: string;
  children?: TreeNode[];
  disabled?: boolean;
}

const TREE_DATA: TreeNode[] = [
  {
    name: 'parent 1',
    children: [
      {
        name: 'parent 1-1',
        disabled: true,
        children: [{ name: 'leaf 1-1-1' }, { name: 'leaf 1-1-2' }]
      },
      {
        name: 'parent 1-2',
        children: [{ name: 'leaf 1-2-1' }]
      }
    ]
  },
  {
    name: 'parent 2',
    children: [{ name: 'leaf 2-1' }]
  }
];

@Component({
  imports: [TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-view
      [dataSource]="dataSource"
      [childrenAccessor]="childrenAccessor"
      [directoryTree]="directoryTree"
      [blockNode]="blockNode"
    >
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
export class TriTestTreeViewBasicWithChildrenAccessorComponent implements OnInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<TreeNode>;
  childrenAccessor = (dataNode: TreeNode): TreeNode[] => dataNode.children ?? [];
  hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;
  selectListSelection = new SelectionModel<TreeNode>(true);
  dataSource!: TriTreeViewNestedDataSource<TreeNode>;
  directoryTree: boolean = false;
  blockNode: boolean = false;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewNestedDataSource<TreeNode>(this.tree, TREE_DATA);
  }

  setData(data: TreeNode[]): void {
    this.dataSource.setData(data);
  }
}

@Component({
  imports: [TriIconModule, TriTreeViewModule],
  template: `
    <tri-tree-view [dataSource]="dataSource" [childrenAccessor]="childrenAccessor">
      <tri-tree-node *treeNodeDef="let node" treeNodeIndentLine [expandable]="false">
        <tri-tree-node-option>
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodeIndentLine [expandable]="true">
        <tri-tree-node-toggle>
          <tri-icon type="caret-down" treeNodeToggleRotateIcon />
        </tri-tree-node-toggle>
        <tri-tree-node-option>
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>
    </tri-tree-view>
  `
})
export class TriTestTreeViewLineComponent implements OnInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<TreeNode>;
  childrenAccessor = (dataNode: TreeNode): TreeNode[] => dataNode.children ?? [];
  hasChild = (_: number, node: TreeNode): boolean => !!node.children?.length;
  dataSource!: TriTreeViewNestedDataSource<TreeNode>;

  ngOnInit(): void {
    this.dataSource = new TriTreeViewNestedDataSource<TreeNode>(this.tree, TREE_DATA);
  }
}
