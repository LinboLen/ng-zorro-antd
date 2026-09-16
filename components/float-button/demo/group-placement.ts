import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-group-placement',
  imports: [TriFloatButtonModule],
  template: `
    <div class="container">
      <div class="box">
        @for (placement of placements; track placement) {
          <tri-float-button-group
            [class]="placement"
            [icon]="icons[$index]"
            type="primary"
            trigger="click"
            [placement]="placement"
          >
            <tri-float-button />
            <tri-float-button icon="comment" />
          </tri-float-button-group>
        }
      </div>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      height: 300px;
      justify-content: space-evenly;
      align-items: center;

      .box {
        height: 100px;
        width: 100px;
        position: relative;

        .top {
          inset-inline-end: 30px;
          bottom: 80px;
        }
        .bottom {
          inset-inline-end: 30px;
          bottom: -20px;
        }
        .left {
          right: 80px;
          bottom: 30px;
        }
        .right {
          left: 80px;
          bottom: 30px;
        }
      }
      nz-float-button-group {
        position: absolute;
      }
    }
  `
})
export class TriDemoFloatButtonGroupPlacementComponent {
  readonly placements = ['top', 'bottom', 'left', 'right'] as const;
  readonly icons = ['up', 'down', 'left', 'right'];
}
