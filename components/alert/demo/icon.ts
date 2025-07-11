import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-icon',
  imports: [TriAlertModule],
  template: `
    <tri-alert type="success" message="Success Tips" showIcon></tri-alert>
    <tri-alert type="info" message="Informational Notes" showIcon></tri-alert>
    <tri-alert type="warning" message="Warning" showIcon></tri-alert>
    <tri-alert type="error" message="Error" showIcon></tri-alert>
    <tri-alert
      type="success"
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      showIcon
    ></tri-alert>
    <tri-alert
      type="info"
      message="Informational Notes"
      description="Additional description and informations about copywriting."
      showIcon
    ></tri-alert>
    <tri-alert
      type="warning"
      message="Warning"
      description="This is a warning notice about copywriting."
      showIcon
    ></tri-alert>
    <tri-alert
      type="error"
      message="Error"
      description="This is an error message about copywriting."
      showIcon
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
export class TriDemoAlertIconComponent {}
