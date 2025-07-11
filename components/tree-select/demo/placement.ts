import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTreeSelectModule, TriPlacementType } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-placement',
  imports: [FormsModule, TriRadioModule, TriTreeSelectModule],
  template: `
    <tri-radio-group [(ngModel)]="placement">
      @for (item of list; track item) {
        <label tri-radio-button [value]="item">{{ item }}</label>
      }
    </tri-radio-group>
    <br />
    <br />
    <tri-tree-select
      style="width: 120px"
      placeHolder="Please select"
      [placement]="placement"
      [(ngModel)]="value"
      [maxTagCount]="3"
      [maxTagPlaceholder]="omittedPlaceHolder"
      [nodes]="nodes"
      [dropdownStyle]="{ width: '300px' }"
      [defaultExpandAll]="true"
      [allowClear]="false"
      [multiple]="true"
      (ngModelChange)="onChange($event)"
    ></tri-tree-select>
    <ng-template #omittedPlaceHolder let-omittedValues>and {{ omittedValues.length }} more...</ng-template>
  `
})
export class TriDemoTreeSelectPlacementComponent {
  list: TriPlacementType[] = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
  placement: TriPlacementType = 'topLeft';
  value: string[] = [];
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

  onChange($event: string[]): void {
    console.log($event);
  }
}
