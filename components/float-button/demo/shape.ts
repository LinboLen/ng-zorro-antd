import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-float-button-shape',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <div class="shape">
      <tri-float-button shape="circle" style="right: 94px" type="primary" [icon]="icon"> </tri-float-button>
      <tri-float-button shape="square" style="right: 24px" type="primary" [icon]="icon"></tri-float-button>
      <ng-template #icon>
        <tri-icon type="customer-service" theme="outline"></tri-icon>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .shape {
        height: 300px;
        position: relative;
      }
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonShapeComponent {}
