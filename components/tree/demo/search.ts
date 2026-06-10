import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriFormatEmitEvent, TriTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: 'tri-demo-tree-search',
  imports: [FormsModule, TriInputModule, TriTreeModule],
  template: `
    <tri-input-search>
      <input type="text" tri-input placeholder="Search" [(ngModel)]="searchValue" />
    </tri-input-search>
    <br />
    <tri-tree
      [data]="nodes"
      [searchValue]="searchValue()"
      (click)="log($event)"
      (expandChange)="log($event)"
      (searchValueChange)="log($event)"
    />
  `
})
export class TriDemoTreeSearchComponent {
  readonly searchValue = signal('');

  readonly nodes = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0', isLeaf: true },
            { title: '0-0-0-1', key: '0-0-0-1', isLeaf: true },
            { title: '0-0-0-2', key: '0-0-0-2', isLeaf: true }
          ]
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0', isLeaf: true },
            { title: '0-0-1-1', key: '0-0-1-1', isLeaf: true },
            { title: '0-0-1-2', key: '0-0-1-2', isLeaf: true }
          ]
        },
        {
          title: '0-0-2',
          key: '0-0-2',
          isLeaf: true
        }
      ]
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0', isLeaf: true },
        { title: '0-1-0-1', key: '0-1-0-1', isLeaf: true },
        { title: '0-1-0-2', key: '0-1-0-2', isLeaf: true }
      ]
    },
    {
      title: '0-2',
      key: '0-2',
      isLeaf: true
    }
  ];

  log(event: TriFormatEmitEvent): void {
    console.log(event);
  }
}
