import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'tri-demo-avatar-responsive',
  imports: [TriAvatarModule],
  template: `<tri-avatar [size]="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100, xxxl: 120 }" icon="user" />`
})
export class TriDemoAvatarResponsiveComponent {}
