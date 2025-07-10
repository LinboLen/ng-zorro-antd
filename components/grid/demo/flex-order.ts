import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [TriGridModule],
  template: `
    <div>
      <div tri-row>
        <div tri-col span="6" order="4">1 col-order-4</div>
        <div tri-col span="6" order="3">2 col-order-3</div>
        <div tri-col span="6" order="2">3 col-order-2</div>
        <div tri-col span="6" order="1">4 col-order-1</div>
      </div>
    </div>
  `,
  styles: [
    `
      [nz-row] {
        background-color: rgba(128, 128, 128, 0.08);
      }
    `
  ]
})
export class TriDemoGridFlexOrderComponent {}
