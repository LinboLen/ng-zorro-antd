import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: '',
  imports: [TriAvatarModule],
  template: `
    <tri-avatar icon="user"></tri-avatar>
    <tri-avatar text="U"></tri-avatar>
    <tri-avatar text="USER"></tri-avatar>
    <tri-avatar icon="user" src="//zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"></tri-avatar>
    <tri-avatar text="U" style="color:#f56a00; background-color:#fde3cf;"></tri-avatar>
    <tri-avatar icon="user" style="background-color:#87d068;"></tri-avatar>
  `,
  styles: [
    `
      nz-avatar {
        margin-top: 16px;
        margin-right: 16px;
      }
    `
  ]
})
export class TriDemoAvatarTypeComponent {}
