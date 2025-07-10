import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFlexDirective } from 'ng-zorro-antd/flex';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: '',
  imports: [FormsModule, TriTreeSelectModule, TriFlexDirective, TriSpaceModule],
  template: `
    <div tri-flex gap="large">
      <tri-space direction="vertical" style="flex: 1">
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          [nodes]="nodes"
          variant="outlined"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          [nodes]="nodes"
          variant="filled"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          [nodes]="nodes"
          variant="borderless"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          [nodes]="nodes"
          variant="underlined"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
      </tri-space>
      <tri-space direction="vertical" style="flex: 1">
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          variant="outlined"
          [nodes]="nodes"
          [maxTagCount]="3"
          [allowClear]="true"
          [multiple]="true"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          variant="filled"
          [nodes]="nodes"
          [maxTagCount]="3"
          [allowClear]="true"
          [multiple]="true"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          variant="borderless"
          [nodes]="nodes"
          [maxTagCount]="3"
          [allowClear]="true"
          [multiple]="true"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
        <tri-tree-select
          *spaceItem
          style="width: 100%"
          variant="underlined"
          [nodes]="nodes"
          [maxTagCount]="3"
          [allowClear]="true"
          [multiple]="true"
          [ngModel]="defaultValue"
          [defaultExpandAll]="true"
        ></tri-tree-select>
      </tri-space>
    </div>
  `
})
export class TriDemoTreeSelectVariantComponent {
  readonly defaultValue = '100';
  readonly nodes = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          children: [
            { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [{ title: 'leaf 1-1-0', key: '10020', isLeaf: true }]
        }
      ]
    }
  ];
}
