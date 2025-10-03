import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-input-addon',
  imports: [TriInputModule, TriIconModule, TriSelectModule, TriCascaderModule, FormsModule],
  template: `
    <tri-input-wrapper>
      <span inputAddonBefore>http://</span>
      <input tri-input [(ngModel)]="value" />
      <span inputAddonAfter>.com</span>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <tri-select inputAddonBefore [ngModel]="'Http://'">
        <tri-option label="Http://" value="Http://"></tri-option>
        <tri-option label="Https://" value="Https://"></tri-option>
      </tri-select>
      <input tri-input [(ngModel)]="value" />
      <tri-select inputAddonAfter [ngModel]="'.com'">
        <tri-option label=".com" value=".com"></tri-option>
        <tri-option label=".jp" value=".jp"></tri-option>
        <tri-option label=".cn" value=".cn"></tri-option>
        <tri-option label=".org" value=".org"></tri-option>
      </tri-select>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <input tri-input [(ngModel)]="value" />
      <tri-icon inputAddonBefore type="setting" />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <span inputAddonBefore>http://</span>
      <input tri-input [(ngModel)]="value" />
      <span inputSuffix>.com</span>
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <tri-cascader inputAddonBefore [options]="[]" placeHolder="cascader" [style.width.px]="150" />
      <input tri-input [(ngModel)]="value" />
    </tri-input-wrapper>
  `
})
export class TriDemoInputAddonComponent {
  readonly value = signal('mysite');
}
