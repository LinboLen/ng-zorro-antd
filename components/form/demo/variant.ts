import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import type { TriVariant } from 'ng-zorro-antd/core/types';
import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriMentionModule } from 'ng-zorro-antd/mention';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-form-variant',
  imports: [
    TriFormModule,
    TriRadioModule,
    FormsModule,
    TriInputModule,
    TriInputNumberModule,
    TriSelectModule,
    TriCascaderModule,
    TriDatePickerModule,
    TriTimePickerModule,
    TriTreeSelectModule,
    TriMentionModule
  ],
  template: `
    <form tri-form [variant]="variant()">
      <tri-form-item>
        <tri-form-label>Form variant</tri-form-label>
        <tri-radio-group [(ngModel)]="variant" name="variant">
          <label tri-radio-button value="outlined">Outlined</label>
          <label tri-radio-button value="filled">Filled</label>
          <label tri-radio-button value="borderless">Borderless</label>
          <label tri-radio-button value="underlined">Underlined</label>
        </tri-radio-group>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Input</tri-form-label>
        <tri-form-control>
          <input placeholder="Please type something" tri-input />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>InputNumber</tri-form-label>
        <tri-form-control>
          <tri-input-number placeHolder="Please enter a number" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Select</tri-form-label>
        <tri-form-control>
          <tri-select placeHolder="Please select">
            <tri-option value="Marie" label="Marie" />
            <tri-option value="John" label="John" />
            <tri-option value="Jill" label="Jill" />
          </tri-select>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Cascader</tri-form-label>
        <tri-form-control>
          <tri-cascader />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>DatePicker</tri-form-label>
        <tri-form-control>
          <tri-date-picker />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item
        ><tri-form-label>TimePicker</tri-form-label>
        <tri-form-control>
          <tri-time-picker />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>Tree Select</tri-form-label>
        <tri-form-control>
          <tri-tree-select [expandedKeys]="expandKeys" [nodes]="nodes" placeHolder="Please select" />
        </tri-form-control>
      </tri-form-item>

      <tri-form-item>
        <tri-form-label>Mention</tri-form-label>
        <tri-form-control>
          <tri-mention [suggestions]="suggestions">
            <textarea rows="1" placeholder="Input here" mentionTrigger tri-input></textarea>
          </tri-mention>
        </tri-form-control>
      </tri-form-item>
    </form>
  `
})
export class TriDemoFormVariantComponent {
  readonly variant = signal<TriVariant>('outlined');

  expandKeys = ['100', '1001'];
  suggestions = ['afc163', 'benjycui', 'yiminghe', 'RaoHai', '中文', 'にほんご'];

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
