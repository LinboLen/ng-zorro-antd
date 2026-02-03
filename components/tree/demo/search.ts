import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriFormatEmitEvent, TriTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: 'tri-demo-tree-search',
  imports: [FormsModule, TriIconModule, TriInputModule, TriTreeModule],
  template: `
    <tri-input-wrapper>
      <input type="text" tri-input placeholder="Search" [(ngModel)]="searchValue" />
      <tri-icon inputSuffix type="search" />
    </tri-input-wrapper>
    <br />
    <tri-tree
      [data]="nodes"
      [searchValue]="searchValue"
      (click)="event($event)"
      (expandChange)="event($event)"
      (searchValueChange)="event($event)"
    />
  `
})
export class TriDemoTreeSearchComponent {
  searchValue = '';

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

  event(event: TriFormatEmitEvent): void {
    console.log(event);
  }
}
