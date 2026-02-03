import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'tri-demo-avatar-badge',
  imports: [TriBadgeModule, TriAvatarModule],
  template: `
    <tri-badge [count]="5" style="margin-right: 24px">
      <tri-avatar icon="user" shape="square" />
    </tri-badge>
    <tri-badge dot>
      <tri-avatar icon="user" shape="square" />
    </tri-badge>
  `
})
export class TriDemoAvatarBadgeComponent {}
