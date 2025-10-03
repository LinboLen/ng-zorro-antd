import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule, TriSelectOptionInterface } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-input-compact',
  imports: [TriInputModule, TriIconModule, TriSelectModule, TriSpaceModule, TriButtonModule, FormsModule],
  template: `
    <tri-space-compact>
      <input tri-input value="26888888" />
    </tri-space-compact>
    <br />
    <br />
    <tri-space-compact>
      <input tri-input value="0571" [style.width.%]="20" />
      <input tri-input value="26888888" [style.width.%]="80" />
    </tri-space-compact>
    <br />
    <br />
    <tri-space-compact>
      <tri-input-wrapper class="tri-input-search">
        <span inputAddonBefore>https://</span>
        <input tri-input type="search" placeholder="input search text" />
        <button inputAddonAfter tri-button class="tri-input-search-button">
          <tri-icon type="search" />
        </button>
      </tri-input-wrapper>
    </tri-space-compact>
    <br />
    <br />
    <tri-space-compact [style.width.%]="100">
      <input tri-input placeholder="Combine input and button" />
      <button tri-button type="primary">Submit</button>
    </tri-space-compact>
    <br />
    <br />
    <tri-space-compact>
      <tri-select [ngModel]="'zhejiang'" [options]="options" />
      <input tri-input placeholder="Xihu District, Hangzhou" />
    </tri-space-compact>
    <br />
    <br />
    <tri-space-compact size="large">
      <tri-input-wrapper>
        <tri-icon inputAddonBefore type="search" />
        <input tri-input placeholder="large size" />
      </tri-input-wrapper>
      <input tri-input placeholder="another input" />
    </tri-space-compact>
  `
})
export class TriDemoInputCompactComponent {
  options: TriSelectOptionInterface[] = [
    {
      value: 'zhejiang',
      label: 'Zhejiang'
    },
    {
      value: 'jiangsu',
      label: 'Jiangsu'
    }
  ];
}
