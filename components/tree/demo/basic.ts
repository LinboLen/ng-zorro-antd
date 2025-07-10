import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { TriFormatEmitEvent, TriTreeComponent, TriTreeModule, TriTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: '',
  imports: [TriTreeModule],
  template: `
    <tri-tree
      #nzTreeComponent
      [data]="nodes"
      checkable
      [checkedKeys]="defaultCheckedKeys"
      [expandedKeys]="defaultExpandedKeys"
      [selectedKeys]="defaultSelectedKeys"
      (click)="click($event)"
      (contextMenu)="click($event)"
      (checkboxChange)="check($event)"
      (expandChange)="check($event)"
    ></tri-tree>
  `
})
export class TriDemoTreeBasicComponent implements AfterViewInit {
  @ViewChild('nzTreeComponent', { static: false }) treeComponent!: TriTreeComponent;
  defaultCheckedKeys = ['10020'];
  defaultSelectedKeys = ['10010'];
  defaultExpandedKeys = ['100', '1001'];

  readonly nodes: TriTreeNodeOptions[] = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          disabled: true,
          children: [
            { title: 'leaf 1-0-0', key: '10010', disableCheckbox: true, isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [
            { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
            { title: 'leaf 1-1-1', key: '10021', isLeaf: true }
          ]
        }
      ]
    }
  ];

  click(event: TriFormatEmitEvent): void {
    console.log(event);
  }

  check(event: TriFormatEmitEvent): void {
    console.log(event);
  }

  // nzSelectedKeys change
  select(keys: string[]): void {
    console.log(keys, this.treeComponent.getSelectedNodeList());
  }

  ngAfterViewInit(): void {
    // get node by key: '10011'
    console.log(this.treeComponent.getTreeNodeByKey('10011'));
    // use tree methods
    console.log(
      this.treeComponent.getTreeNodes(),
      this.treeComponent.getCheckedNodeList(),
      this.treeComponent.getSelectedNodeList(),
      this.treeComponent.getExpandedNodeList()
    );
  }
}
