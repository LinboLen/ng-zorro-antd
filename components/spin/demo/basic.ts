import { Component } from '@angular/core';

import { TriSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'tri-demo-spin-basic',
  imports: [TriSpinModule],
  template: `<tri-spin simple />`
})
export class TriDemoSpinBasicComponent {}
