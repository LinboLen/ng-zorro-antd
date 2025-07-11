import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-grid-flex',
  imports: [TriGridModule],
  template: `
    <div>
      <p>sub-element align left</p>
      <div tri-row justify="start">
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
      </div>
      <p>sub-element align center</p>
      <div tri-row justify="center">
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
      </div>
      <p>sub-element align right</p>
      <div tri-row justify="end">
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
      </div>
      <p>sub-element monospaced arrangement</p>
      <div tri-row justify="space-between">
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
      </div>
      <p>sub-element align full</p>
      <div tri-row justify="space-around">
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
      </div>
      <p>sub-element align evenly</p>
      <div tri-row justify="space-evenly">
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
        <div tri-col span="4">col-4</div>
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
export class TriDemoGridFlexComponent {}
