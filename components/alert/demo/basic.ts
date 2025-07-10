import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: '',
  imports: [TriAlertModule],
  template: `<tri-alert type="success" message="Success Text"></tri-alert>`
})
export class TriDemoAlertBasicComponent {}
