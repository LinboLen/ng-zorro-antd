import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-banner',
  imports: [TriAlertModule],
  template: `
    <tri-alert banner message="Warning text"></tri-alert>
    <tri-alert
      banner
      message="Very long warning text warning text text text text text text text"
      closeable
    ></tri-alert>
    <tri-alert banner message="Warning text without icon" [showIcon]="false"></tri-alert>
    <tri-alert banner type="error" message="Error text"></tri-alert>
  `,
  styles: [
    `
      nz-alert {
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoAlertBannerComponent {}
