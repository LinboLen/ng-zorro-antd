import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import { TriColorPickerModule } from 'ng-zorro-antd/color-picker';
import type { TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSwitchModule } from 'ng-zorro-antd/switch';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-form-size',
  imports: [
    FormsModule,
    TriFormModule,
    TriRadioModule,
    TriInputModule,
    TriInputNumberModule,
    TriCascaderModule,
    TriSelectModule,
    TriTreeSelectModule,
    TriDatePickerModule,
    TriButtonModule,
    TriTimePickerModule,
    TriSwitchModule,
    TriColorPickerModule
  ],
  template: `
    <form tri-form [size]="size()">
      <tri-form-item>
        <tri-form-label>Size</tri-form-label>
        <tri-form-control>
          <tri-radio-group name="size" [(ngModel)]="size">
            <label tri-radio-button value="small">Small</label>
            <label tri-radio-button value="default">Default</label>
            <label tri-radio-button value="large">Large</label>
          </tri-radio-group>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Input</tri-form-label>
        <tri-form-control>
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Input Number</tri-form-label>
        <tri-form-control>
          <tri-input-number />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Cascader</tri-form-label>
        <tri-form-control>
          <tri-cascader [options]="[]" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Select</tri-form-label>
        <tri-form-control>
          <tri-select [options]="[]" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Tree Select</tri-form-label>
        <tri-form-control>
          <tri-tree-select
            [expandedKeys]="expandKeys"
            [nodes]="nodes"
            showSearch
            placeHolder="Please select"
            [nodes]="nodes"
          />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Date Picker</tri-form-label>
        <tri-form-control>
          <tri-date-picker />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Time Picker</tri-form-label>
        <tri-form-control>
          <tri-time-picker />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Switch</tri-form-label>
        <tri-form-control>
          <tri-switch />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Color Picker</tri-form-label>
        <tri-color-picker />
      </tri-form-item>
      <button tri-button type="primary">Button</button>
    </form>
  `
})
export class TriDemoFormSizeComponent {
  readonly size = signal<TriSizeLDSType>('default');

  expandKeys = ['100', '1001'];

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
