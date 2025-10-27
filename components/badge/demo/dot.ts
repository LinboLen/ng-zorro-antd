import { Component } from '@angular/core';

import { TriBadgeModule } from 'ng-zorro-antd/badge';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-badge-dot',
  imports: [TriBadgeModule, TriIconModule],
  template: `
    <tri-badge dot>
      <tri-icon type="notification" />
    </tri-badge>
    <tri-badge dot>
      <a>Link something</a>
    </tri-badge>
  `,
  styles: [
    `
      nz-badge {
        margin-right: 20px;
      }

      nz-icon {
        font-size: 16px;
      }
    `
  ]
})
export class TriDemoBadgeDotComponent {}
