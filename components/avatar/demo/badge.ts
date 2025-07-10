import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: '',
  imports: [TriBadgeModule, TriAvatarModule],
  template: `
    <tri-badge [count]="5" style="margin-right: 24px">
      <tri-avatar icon="user" shape="square"></tri-avatar>
    </tri-badge>
    <tri-badge dot>
      <tri-avatar icon="user" shape="square"></tri-avatar>
    </tri-badge>
  `
})
export class TriDemoAvatarBadgeComponent {}
