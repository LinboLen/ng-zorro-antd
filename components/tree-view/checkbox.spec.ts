/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriTreeViewFlatDataSource } from './flat-data-source';
import { TriTreeFlattener } from './flattener';
import { TriTreeViewComponent } from './tree-view';
import { TriTreeViewModule } from './tree-view.module';
import { getParent, getDescendants } from './utils';

describe('checkbox component for tree view', () => {
  let fixture: ComponentFixture<TriTestTreeViewCheckBoxComponent>;
  let testComponent: TriTestTreeViewCheckBoxComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideNzIconsTesting(), provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TriTestTreeViewCheckBoxComponent);
    testComponent = fixture.componentInstance;
    await fixture.whenStable();
    // expand all node
    const { tree } = testComponent;
    tree.expandAll();
    await fixture.whenStable();
  });

  it('should check all children nodes when the parent is checked, vice versa', async () => {
    const nodes = fixture.debugElement.queryAll(By.css('nz-tree-node-checkbox'));
    const parent_1 = nodes[0];
    // checked parent
    parent_1.nativeElement.click();
    await fixture.whenStable();
    nodes.slice(0, 6).forEach(node => {
      expect(node.nativeElement.classList).toContain('ant-tree-checkbox-checked');
    });
    nodes.slice(6, nodes.length).forEach(node => {
      expect(node.nativeElement.classList).not.toContain('ant-tree-checkbox-checked');
    });
    // unchecked parent
    parent_1.nativeElement.click();
    await fixture.whenStable();
    nodes.forEach(node => {
      expect(node.nativeElement.classList).not.toContain('ant-tree-checkbox-checked');
    });
  });

  it('should indeterminate parent when its child is checked', async () => {
    const nodes = fixture.debugElement.queryAll(By.css('nz-tree-node-checkbox'));
    const leaf_1_1_1 = nodes[2];
    leaf_1_1_1.nativeElement.click();
    await fixture.whenStable();
    expect(leaf_1_1_1.nativeElement.classList).toContain('ant-tree-checkbox-checked');
    const parent_1_1 = nodes[1];
    const parent_1 = nodes[0];
    expect(parent_1_1.nativeElement.classList).toContain('ant-tree-checkbox-indeterminate');
    expect(parent_1.nativeElement.classList).toContain('ant-tree-checkbox-indeterminate');
    nodes.slice(3, 8).forEach(node => {
      expect(node.nativeElement.classList).not.toContain('ant-tree-checkbox-checked');
    });
  });

  it('should not be checked when the node is disabled', async () => {
    const checkboxList = fixture.debugElement.queryAll(By.css('nz-tree-node-checkbox'));
    const parent_1_1 = fixture.debugElement.queryAll(By.css('nz-tree-node:not([builtin])'))[1];
    const parent_1_1_checkbox = parent_1_1.query(By.css('nz-tree-node-checkbox'));
    // disable status
    expect(parent_1_1.nativeElement.classList).toContain('ant-tree-treenode-disabled');
    expect(parent_1_1_checkbox.nativeElement.classList).toContain('ant-tree-checkbox-disabled');

    // click
    parent_1_1.nativeElement.click();
    await fixture.whenStable();
    checkboxList.forEach(checkbox => {
      expect(checkbox.nativeElement.classList).not.toContain('ant-tree-checkbox-checked');
    });
    parent_1_1_checkbox.nativeElement.click();
    await fixture.whenStable();
    checkboxList.forEach(checkbox => {
      expect(checkbox.nativeElement.classList).not.toContain('ant-tree-checkbox-checked');
    });
  });
});

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

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
    <tri-tree-view [dataSource]="dataSource" [levelAccessor]="levelAccessor">
      <tri-tree-node *treeNodeDef="let node" treeNodeIndentLine [expandable]="false">
        <tri-tree-node-checkbox
          [disabled]="node.disabled"
          [checked]="checklistSelection.isSelected(node)"
          (click)="leafItemSelectionToggle(node)"
        ></tri-tree-node-checkbox>
        <tri-tree-node-option [disabled]="node.disabled" (click)="leafItemSelectionToggle(node)">
          {{ node.name }}
        </tri-tree-node-option>
      </tri-tree-node>

      <tri-tree-node *treeNodeDef="let node; treeNodeDefWhen: hasChild" treeNodeIndentLine [expandable]="true">
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
export class TriTestTreeViewCheckBoxComponent implements OnInit {
  @ViewChild(TriTreeViewComponent, { static: true }) tree!: TriTreeViewComponent<FlatNode>;
  levelAccessor = (dataNode: FlatNode): number => dataNode.level;
  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled
  });
  checklistSelection = new SelectionModel<FlatNode>(true);
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

  private getDescendants(node: FlatNode): FlatNode[] {
    return getDescendants(this.tree.dataNodes, node, this.levelAccessor);
  }

  private getParentNode(node: FlatNode): FlatNode | null {
    return getParent(this.tree.dataNodes, node, this.levelAccessor);
  }

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.getDescendants(node);
    return descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  itemSelectionToggle(node: FlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  checkAllParentsSelection(node: FlatNode): void {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): void {
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
