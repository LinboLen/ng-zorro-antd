import { Component } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';
import { TriBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'tri-demo-avatar-badge',
  imports: [TriAvatarModule, TriBadgeModule],
  template: `
    <tri-badge [count]="5">
      <tri-avatar icon="user" shape="square" />
    </tri-badge>
    <tri-badge dot>
      <tri-avatar icon="user" shape="square" />
    </tri-badge>
  `,
  styles: `
    :host {
      display: inline-flex;
      gap: 24px;
    }
  `
})
export class TriDemoAvatarBadgeComponent {}
