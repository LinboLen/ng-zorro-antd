import { Component } from '@angular/core';

import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [TriSelectModule, TriSpaceModule],
  template: `
    <tri-select status="error"></tri-select>
    <br />
    <br />
    <tri-select status="warning"></tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectStatusComponent {}
