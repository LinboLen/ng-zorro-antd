import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: '',
  imports: [TriAvatarModule, TriDividerModule, TriToolTipModule, TriIconModule],
  template: `
    <tri-avatar-group>
      <tri-avatar icon="user" src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></tri-avatar>
      <tri-avatar style="background-color: #f56a00" text="U"></tri-avatar>
      <tri-avatar style="background-color: #87d068" tri-tooltip tooltipTitle="NG-ZORRO User" icon="user"></tri-avatar>
      <tri-avatar style="background-color: #1890ff" text="NG"></tri-avatar>
      <tri-avatar [size]="32">
        <tri-icon type="ant-design" theme="outline" />
      </tri-avatar>
    </tri-avatar-group>
    <tri-divider></tri-divider>
    <tri-avatar-group>
      <tri-avatar icon="user" src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></tri-avatar>
      <tri-avatar style="background-color: #f56a00" text="U"></tri-avatar>
      <tri-avatar style="background-color: #fde3cf; color: #f56a00" text="+2"></tri-avatar>
    </tri-avatar-group>
  `
})
export class TriDemoAvatarGroupComponent {}
