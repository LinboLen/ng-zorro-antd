import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-close-text',
  imports: [TriAlertModule],
  template: `<tri-alert type="info" message="Info Text" closeText="Close Now"></tri-alert>`
})
export class TriDemoAlertCloseTextComponent {}
