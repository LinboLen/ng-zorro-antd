import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: '',
  imports: [TriAlertModule],
  template: `
    <tri-alert
      type="success"
      message="Success Text"
      description="Success Description Success Description Success Description"
    ></tri-alert>
    <tri-alert
      type="info"
      message="Info Text"
      description="Info Description Info Description Info Description Info Description"
    ></tri-alert>
    <tri-alert
      type="warning"
      message="Warning Text"
      description="Warning Description Warning Description Warning Description Warning Description"
    ></tri-alert>
    <tri-alert
      type="error"
      message="Error Text"
      description="Error Description Error Description Error Description Error Description"
    ></tri-alert>
  `,
  styles: [
    `
      nz-alert {
        margin-bottom: 16px;
      }
    `
  ]
})
export class TriDemoAlertDescriptionComponent {}
