import { Component } from '@angular/core';

import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-select-status',
  imports: [TriSelectModule, TriSpaceModule],
  template: `
    <tri-select status="error" />
    <br />
    <br />
    <tri-select status="warning" />
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectStatusComponent {}
