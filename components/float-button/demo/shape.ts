import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-shape',
  imports: [TriFloatButtonModule],
  template: `
    <div class="shape">
      <tri-float-button shape="circle" style="right: 94px" type="primary" icon="customer-service" />
      <tri-float-button shape="square" style="right: 24px" type="primary" icon="customer-service" />
    </div>
  `,
  styles: `
    .shape {
      height: 300px;
      position: relative;
    }
    nz-float-button {
      position: absolute;
    }
  `
})
export class TriDemoFloatButtonShapeComponent {}
