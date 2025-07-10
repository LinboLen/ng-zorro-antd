import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: '',
  imports: [TriAlertModule],
  template: `
    <tri-alert type="success" message="Success Text"></tri-alert>
    <tri-alert type="info" message="Info Text"></tri-alert>
    <tri-alert type="warning" message="Warning Text"></tri-alert>
    <tri-alert type="error" message="Error Text"></tri-alert>
  `,
  styles: [
    `
      nz-alert {
        margin-bottom: 16px;
      }
    `
  ]
})
export class TriDemoAlertStyleComponent {}
