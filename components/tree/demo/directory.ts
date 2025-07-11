import { LowerCasePipe } from '@angular/common';
import { Component } from '@angular/core';

import { TriContextMenuService, TriDropdownMenuComponent, TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriFormatEmitEvent, TriTreeModule, TriTreeNode } from 'ng-zorro-antd/tree';

@Component({
  selector: 'tri-demo-tree-directory',
  imports: [TriDropDownModule, TriIconModule, TriTreeModule, LowerCasePipe],
  template: `
    <tri-tree
      blockNode
      [data]="nodes"
      (click)="activeNode($event)"
      (dblClick)="openFolder($event)"
      [treeTemplate]="treeTemplate"
    ></tri-tree>
    <ng-template #nzTreeTemplate let-node let-origin="origin">
      <span class="custom-node">
        @if (!node.isLeaf) {
          <span (contextmenu)="contextMenu($event, menu)">
            <tri-icon [type]="node.isExpanded ? 'folder-open' : 'folder'" (click)="openFolder(node)" />
            <span class="folder-name">{{ node.title }}</span>
            <span class="folder-desc">created by {{ origin.author | lowercase }}</span>
          </span>
        } @else {
          <span (contextmenu)="contextMenu($event, menu)">
            <tri-icon type="file" />
            <span class="file-name">{{ node.title }}</span>
            <span class="file-desc">modified by {{ origin.author | lowercase }}</span>
          </span>
        }
      </span>
    </ng-template>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item (click)="selectDropdown()">Action 1</li>
        <li tri-menu-item (click)="selectDropdown()">Action 2</li>
      </ul>
    </tri-dropdown-menu>
  `,
  styles: [
    `
      nz-tree {
        overflow: hidden;
        margin: 0 -24px;
        padding: 0 24px;
      }

      .custom-node {
        cursor: pointer;
        line-height: 24px;
        margin-left: 4px;
        display: inline-block;
      }

      .file-name,
      .folder-name {
        margin-left: 4px;
      }

      .file-desc,
      .folder-desc {
        padding: 0 8px;
        display: inline-block;
        background: #87ceff;
        color: #ffffff;
        position: relative;
        left: 12px;
      }
    `
  ]
})
export class TriDemoTreeDirectoryComponent {
  activatedNode?: TriTreeNode;
  readonly nodes = [
    {
      title: 'parent 0',
      key: '100',
      author: 'NG ZORRO',
      expanded: true,
      children: [
        { title: 'leaf 0-0', key: '1000', author: 'NG ZORRO', isLeaf: true },
        { title: 'leaf 0-1', key: '1001', author: 'NG ZORRO', isLeaf: true }
      ]
    },
    {
      title: 'parent 1',
      key: '101',
      author: 'NG ZORRO',
      children: [
        { title: 'leaf 1-0', key: '1010', author: 'NG ZORRO', isLeaf: true },
        { title: 'leaf 1-1', key: '1011', author: 'NG ZORRO', isLeaf: true }
      ]
    }
  ];

  constructor(private nzContextMenuService: TriContextMenuService) {}

  openFolder(data: TriTreeNode | TriFormatEmitEvent): void {
    // do something if u want
    if (data instanceof TriTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  activeNode(data: TriFormatEmitEvent): void {
    this.activatedNode = data.node!;
  }

  contextMenu($event: MouseEvent, menu: TriDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  selectDropdown(): void {
    // do something
  }
}
