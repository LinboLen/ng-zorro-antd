import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-input-presuffix',
  imports: [TriInputModule, TriIconModule, TriToolTipModule],
  template: `
    <tri-input-group [suffix]="suffixTemplateInfo" [prefix]="prefixTemplateUser">
      <input type="text" tri-input placeholder="Enter your username" />
    </tri-input-group>
    <ng-template #prefixTemplateUser><tri-icon type="user" /></ng-template>
    <ng-template #suffixTemplateInfo>
      <tri-icon tri-tooltip tooltipTitle="Extra information" type="info-circle" />
    </ng-template>
    <br />
    <br />
    <tri-input-group suffix="RMB" prefix="￥">
      <input type="text" tri-input />
    </tri-input-group>
  `
})
export class TriDemoInputPresuffixComponent {}
