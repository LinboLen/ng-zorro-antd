import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'tri-demo-avatar-basic',
  imports: [TriAvatarModule],
  template: `
    <div>
      <tri-avatar [size]="64" icon="user"></tri-avatar>
      <tri-avatar size="large" icon="user"></tri-avatar>
      <tri-avatar icon="user"></tri-avatar>
      <tri-avatar size="small" icon="user"></tri-avatar>
    </div>
    <div>
      <tri-avatar shape="square" [size]="64" icon="user"></tri-avatar>
      <tri-avatar shape="square" size="large" icon="user"></tri-avatar>
      <tri-avatar shape="square" icon="user"></tri-avatar>
      <tri-avatar shape="square" size="small" icon="user"></tri-avatar>
    </div>
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
export class TriDemoAvatarBasicComponent {}
