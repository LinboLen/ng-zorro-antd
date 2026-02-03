import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-style',
  imports: [TriAlertModule],
  template: `
    <tri-alert type="success" message="Success Text" />
    <tri-alert type="info" message="Info Text" />
    <tri-alert type="warning" message="Warning Text" />
    <tri-alert type="error" message="Error Text" />
  `,
  styles: `
    nz-alert {
      margin-bottom: 16px;
    }
  `
})
export class TriDemoAlertStyleComponent {}
