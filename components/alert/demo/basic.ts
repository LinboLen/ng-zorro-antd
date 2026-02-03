import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-basic',
  imports: [TriAlertModule],
  template: `<tri-alert type="success" message="Success Text" />`
})
export class TriDemoAlertBasicComponent {}
