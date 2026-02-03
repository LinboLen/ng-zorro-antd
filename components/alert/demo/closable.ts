import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-closable',
  imports: [TriAlertModule],
  template: `
    <tri-alert
      type="warning"
      closeable
      message="Warning Text Warning Text Warning Text Warning Text Warning Text Warning Text Warning Text"
      (onClose)="afterClose()"
    />
    <tri-alert
      type="error"
      closeable
      message="Error Text"
      description="Error Description Error Description Error Description Error Description Error Description Error Description"
      (onClose)="afterClose()"
    />
  `,
  styles: `
    nz-alert {
      margin-bottom: 16px;
    }
  `
})
export class TriDemoAlertClosableComponent {
  afterClose(): void {
    console.log('close');
  }
}
