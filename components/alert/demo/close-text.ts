import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: '',
  imports: [TriAlertModule],
  template: `<tri-alert type="info" message="Info Text" closeText="Close Now"></tri-alert>`
})
export class TriDemoAlertCloseTextComponent {}
