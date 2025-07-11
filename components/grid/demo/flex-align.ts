import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-grid-flex-align',
  imports: [TriGridModule],
  template: `
    <div>
      <p>Align Top</p>
      <div tri-row justify="center" align="top">
        <div tri-col span="4"><p class="height-100">col-4</p></div>
        <div tri-col span="4"><p class="height-50">col-4</p></div>
        <div tri-col span="4"><p class="height-120">col-4</p></div>
        <div tri-col span="4"><p class="height-80">col-4</p></div>
      </div>
      <p>Align Center</p>
      <div tri-row justify="space-around" align="middle">
        <div tri-col span="4"><p class="height-100">col-4</p></div>
        <div tri-col span="4"><p class="height-50">col-4</p></div>
        <div tri-col span="4"><p class="height-120">col-4</p></div>
        <div tri-col span="4"><p class="height-80">col-4</p></div>
      </div>
      <p>Align Bottom</p>
      <div tri-row justify="space-between" align="bottom">
        <div tri-col span="4"><p class="height-100">col-4</p></div>
        <div tri-col span="4"><p class="height-50">col-4</p></div>
        <div tri-col span="4"><p class="height-120">col-4</p></div>
        <div tri-col span="4"><p class="height-80">col-4</p></div>
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
export class TriDemoGridFlexAlignComponent {}
