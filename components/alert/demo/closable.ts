import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: '',
  imports: [TriAlertModule],
  template: `
    <tri-alert
      type="warning"
      closeable
      message="Warning Text Warning Text Warning Text Warning Text Warning Text Warning Text Warning Text"
      (onClose)="afterClose()"
    ></tri-alert>
    <tri-alert
      type="error"
      closeable
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      (onClose)="afterClose()"
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
export class TriDemoAlertClosableComponent {
  afterClose(): void {
    console.log('close');
  }
}
