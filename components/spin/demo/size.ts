import { Component } from '@angular/core';

import { TriSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'tri-demo-spin-size',
  imports: [TriSpinModule],
  template: `
    <tri-spin simple size="small"></tri-spin>
    <tri-spin simple></tri-spin>
    <tri-spin simple size="large"></tri-spin>
  `,
  styles: [
    `
      nz-spin {
        display: inline-block;
        margin-right: 16px;
      }
    `
  ]
})
export class TriDemoSpinSizeComponent {}
