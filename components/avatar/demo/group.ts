import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-avatar-group',
  imports: [TriAvatarModule, TriDividerModule, TriTooltipModule, TriIconModule],
  template: `
    <tri-avatar-group>
      <tri-avatar icon="user" src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <tri-avatar style="background-color: #f56a00" text="U" />
      <tri-avatar style="background-color: #87d068" tri-tooltip tooltipTitle="NG-ZORRO User" icon="user" />
      <tri-avatar style="background-color: #1890ff" text="NG" />
      <tri-avatar [size]="32">
        <tri-icon type="ant-design" theme="outline" />
      </tri-avatar>
    </tri-avatar-group>
    <tri-divider />
    <tri-avatar-group>
      <tri-avatar icon="user" src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <tri-avatar style="background-color: #f56a00" text="U" />
      <tri-avatar style="background-color: #fde3cf; color: #f56a00" text="+2" />
    </tri-avatar-group>
  `
})
export class TriDemoAvatarGroupComponent {}
