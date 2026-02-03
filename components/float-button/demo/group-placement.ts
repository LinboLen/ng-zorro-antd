import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-group-placement',
  imports: [TriFloatButtonModule],
  template: `
    <div class="container">
      <div class="anchor">
        <tri-float-button-group
          class="up"
          icon="up"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="top"
        >
          <tri-float-button />
          <tri-float-button icon="comment" />
        </tri-float-button-group>
        <tri-float-button-group
          class="down"
          icon="down"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="bottom"
        >
          <tri-float-button />
          <tri-float-button icon="comment" />
        </tri-float-button-group>
        <tri-float-button-group
          class="left"
          icon="left"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="left"
        >
          <tri-float-button />
          <tri-float-button icon="comment" />
        </tri-float-button-group>
        <tri-float-button-group
          class="right"
          icon="right"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="right"
        >
          <tri-float-button />
          <tri-float-button icon="comment" />
        </tri-float-button-group>
      </div>
    </div>
  `,
  styles: `
    .container {
      display: flex;
      height: 300px;
      justify-content: center;
      align-items: center;

      .anchor {
        height: 100px;
        width: 100px;
        position: relative;

        .up {
          inset-inline-end: 30px;
          bottom: 80px;
        }
        .down {
          inset-inline-end: 30px;
          bottom: -20px;
        }
        .left {
          inset-inline-end: 80px;
          bottom: 30px;
        }
        .right {
          inset-inline-end: -20px;
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
  openChange(status: boolean): void {
    console.log(status);
  }
}
