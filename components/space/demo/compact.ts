import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCascaderModule, TriCascaderOption } from 'ng-zorro-antd/cascader';
import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-space-compact',
  imports: [
    TriSpaceModule,
    TriButtonModule,
    TriIconModule,
    TriInputModule,
    TriInputNumberModule,
    TriSelectModule,
    TriCascaderModule,
    TriTreeSelectModule,
    TriDatePickerModule,
    TriTimePickerModule,
    TriAutocompleteModule,
    TriTooltipModule,
    FormsModule
  ],
  template: `
    <tri-space-compact block>
      <input tri-input value="0571" [style.width.%]="20" />
      <input tri-input value="26888888" [style.width.%]="30" />
    </tri-space-compact>
    <br />
    <tri-space-compact block size="small">
      <input tri-input value="https://ng.ant.design" [style.width]="'calc(100% - 200px)'" />
      <button tri-button type="primary">Submit</button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <input tri-input value="https://ng.ant.design" [style.width]="'calc(100% - 200px)'" />
      <button tri-button type="primary">Submit</button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <input tri-input value="git@github.com:NG-ZORRO/ng-zorro-antd.git" [style.width]="'calc(100% - 200px)'" />
      <button tri-button tri-tooltip tooltipTitle="copy git url">
        <tri-icon type="copy" />
      </button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-select ngModel="Zhejianggggg">
        <tri-option label="Zhejianggggg" value="Zhejianggggg"></tri-option>
        <tri-option label="Jiangsu" value="Jiangsu"></tri-option>
      </tri-select>
      <input tri-input value="Xihu District, Hangzhou" [style.width.%]="50" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-input-search [style.width.%]="30">
        <input tri-input value="0571" />
      </tri-input-search>
      <tri-input-search [style.width.%]="50">
        <input tri-input value="26888888" />
      </tri-input-search>
      <tri-input-search [style.width.%]="20">
        <input tri-input value="+1" />
      </tri-input-search>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-select mode="multiple" [ngModel]="['Zhejianggggg']" [style.width.%]="50">
        <tri-option label="Zhejianggggg" value="Zhejianggggg"></tri-option>
        <tri-option label="Jiangsu" value="Jiangsu"></tri-option>
      </tri-select>
      <input tri-input value="Xihu District, Hangzhou" [style.width.%]="50" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-select ngModel="Option1">
        <tri-option label="Option1" value="Option1"></tri-option>
        <tri-option label="Option2" value="Option2"></tri-option>
      </tri-select>
      <input tri-input value="input content" [style.width.%]="50" />
      <tri-input-number [ngModel]="12" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <input tri-input value="input content" [style.width.%]="50" />
      <tri-date-picker [style.width.%]="50" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-range-picker [style.width.%]="70" />
      <input tri-input value="input content" [style.width.%]="30" />
      <button tri-button type="primary">查询</button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <input tri-input value="input content" [style.width.%]="30" />
      <tri-range-picker [style.width.%]="70" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-select ngModel="Option1-1">
        <tri-option label="Option1-1" value="Option1-1"></tri-option>
        <tri-option label="Option2-1" value="Option2-1"></tri-option>
      </tri-select>
      <tri-select ngModel="Option1-2">
        <tri-option label="Option1-2" value="Option1-2"></tri-option>
        <tri-option label="Option2-2" value="Option2-2"></tri-option>
      </tri-select>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-select ngModel="1">
        <tri-option label="Between" value="1"></tri-option>
        <tri-option label="Except" value="2"></tri-option>
      </tri-select>
      <input tri-input placeholder="Minimum" style="width: 100px; text-align: center" />
      <input
        tri-input
        class="site-input-split"
        style="
          width: 30px;
          border-left: 0;
          border-right: 0;
          pointer-events: none
        "
        placeholder="~"
        disabled
      />
      <input tri-input class="site-input-right" style="width: 100px; text-align: center" placeholder="Maximum" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-select ngModel="Sign Up" [style.width.%]="30">
        <tri-option label="Sign Up" value="Sign Up"></tri-option>
        <tri-option label="Sign In" value="Sign In"></tri-option>
      </tri-select>
      <tri-autocomplete #auto [dataSource]="['text 1', 'text 2']" />
      <input tri-input placeholder="Email" [autocomplete]="auto" [style.width.%]="70" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-time-picker [style.width.%]="70" />
      <tri-cascader [options]="cascaderOptions" placeholder="Select Address" [style.width.%]="70" />
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-tree-select
        [nodes]="nodes"
        showSearch
        placeHolder="Please select"
        ngModel="10010"
        defaultExpandAll
        [style.width.%]="60"
      ></tri-tree-select>
      <button tri-button type="primary">Submit</button>
    </tri-space-compact>
    <br />
    <tri-space-compact block>
      <tri-input-wrapper addOnBefore="Http://" addOnAfter=".com" [style.width.%]="50">
        <input tri-input placeholder="input here" />
      </tri-input-wrapper>
      <tri-input-number>
        <span inputPrefix>$</span>
      </tri-input-number>
      <tri-input-number>
        <span inputAddonBefore>$</span>
      </tri-input-number>
    </tri-space-compact>
  `,
  styles: [
    `
      .site-input-split {
        background-color: #fff;
      }

      .site-input-right:not(.ant-input-rtl) {
        border-left-width: 0;
      }

      .site-input-right:not(.ant-input-rtl):hover,
      .site-input-right:not(.ant-input-rtl):focus {
        border-left-width: 1px;
      }

      .site-input-right.ant-input-rtl {
        border-right-width: 0;
      }

      .site-input-right.ant-input-rtl:hover,
      .site-input-right.ant-input-rtl:focus {
        border-right-width: 1px;
      }
    `
  ]
})
export class TriDemoSpaceCompactComponent {
  cascaderOptions: TriCascaderOption[] = [
    {
      value: 'zhejiang',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: 'West Lake',
              isLeaf: true
            }
          ]
        }
      ]
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: 'Zhong Hua Men',
              isLeaf: true
            }
          ]
        }
      ]
    }
  ];

  nodes = [
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
