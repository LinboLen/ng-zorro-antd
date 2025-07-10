import { Component, ViewChild } from '@angular/core';

import { TriFormatEmitEvent, TriTreeNode, TriTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TriTransferModule, TransferChange } from 'ng-zorro-antd/transfer';
import { TriTreeComponent, TriTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: '',
  imports: [TriTransferModule, TriTreeModule],
  template: `
    <tri-transfer
      [dataSource]="list"
      [showSelectAll]="false"
      [renderList]="[leftRenderList, null]"
      (change)="change($event)"
    >
      <ng-template #leftRenderList let-items let-onItemSelectAll="onItemSelectAll" let-onItemSelect="onItemSelect">
        <tri-tree
          #tree
          [data]="treeData"
          expandAll
          blockNode
          checkable
          checkStrictly
          (checkboxChange)="treeCheckboxChange($event, onItemSelect)"
        >
          <ng-template #nzTreeTemplate let-node>
            <span
              (click)="checkboxChange(node, onItemSelect)"
              class="tri-tree-node-content-wrapper tri-tree-node-content-wrapper-open"
            >
              {{ node.title }}
            </span>
          </ng-template>
        </tri-tree>
      </ng-template>
    </tri-transfer>
  `
})
export class TriDemoTransferTreeTransferComponent {
  @ViewChild('tree', { static: true }) tree!: TriTreeComponent;
  list: TriTreeNodeOptions[] = [
    { key: '0', id: 0, title: '0-0', isLeaf: true },
    { key: '1', id: 1, parentid: 0, title: '0-1' },
    { key: '2', id: 2, parentid: 1, title: '0-1-0', isLeaf: true },
    { key: '3', id: 3, parentid: 1, title: '0-1-1', isLeaf: true },
    { key: '4', id: 4, title: '0-3', isLeaf: true }
  ];
  treeData = this.generateTree(this.list);
  checkedNodeList: TriTreeNode[] = [];

  private generateTree(arr: TriTreeNodeOptions[]): TriTreeNodeOptions[] {
    const tree: TriTreeNodeOptions[] = [];
    const mappedArr: Record<string, TriTreeNodeOptions> = {};
    let arrElem: TriTreeNodeOptions;
    let mappedElem: TriTreeNodeOptions;

    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = { ...arrElem };
      mappedArr[arrElem.id].children = [];
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        if (mappedElem.parentid) {
          mappedArr[mappedElem.parentid].children!.push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  treeCheckboxChange(event: TriFormatEmitEvent, onItemSelect: (item: TriTreeNodeOptions) => void): void {
    this.checkboxChange(event.node!, onItemSelect);
  }

  checkboxChange(node: TriTreeNode, onItemSelect: (item: TriTreeNodeOptions) => void): void {
    if (node.isDisabled) {
      return;
    }

    if (node.isChecked) {
      this.checkedNodeList.push(node);
    } else {
      const idx = this.checkedNodeList.indexOf(node);
      if (idx !== -1) {
        this.checkedNodeList.splice(idx, 1);
      }
    }
    const item = this.list.find(w => w.id === node.origin.id);
    onItemSelect(item!);
  }

  change(ret: TransferChange): void {
    const isDisabled = ret.to === 'right';
    this.checkedNodeList.forEach(node => {
      if (ret.list.find(w => w.key === node.key)) {
        node.isDisabled = isDisabled;
        node.isChecked = isDisabled;
      }
    });
    this.checkedNodeList = this.checkedNodeList.filter(item => item.isChecked);
  }
}
