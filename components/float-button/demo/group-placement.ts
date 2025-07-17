import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-float-button-group-placement',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <div class="container">
      <div class="anchor">
        <tri-float-button-group
          class="up"
          [icon]="up"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="top"
        >
          <tri-float-button></tri-float-button>
          <tri-float-button [icon]="inner"></tri-float-button>
        </tri-float-button-group>
        <tri-float-button-group
          class="down"
          [icon]="down"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="bottom"
        >
          <tri-float-button></tri-float-button>
          <tri-float-button [icon]="inner"></tri-float-button>
        </tri-float-button-group>
        <tri-float-button-group
          class="left"
          [icon]="left"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="left"
        >
          <tri-float-button></tri-float-button>
          <tri-float-button [icon]="inner"></tri-float-button>
        </tri-float-button-group>
        <tri-float-button-group
          class="right"
          [icon]="right"
          type="primary"
          trigger="click"
          (onOpenChange)="openChange($event)"
          placement="right"
        >
          <tri-float-button></tri-float-button>
          <tri-float-button [icon]="inner"></tri-float-button>
        </tri-float-button-group>
      </div>
      <ng-template #inner>
        <tri-icon type="comment" theme="outline"></tri-icon>
      </ng-template>
      <ng-template #up>
        <tri-icon type="up" theme="outline" />
      </ng-template>
      <ng-template #down>
        <tri-icon type="down" theme="outline" />
      </ng-template>
      <ng-template #left>
        <tri-icon type="left" theme="outline" />
      </ng-template>
      <ng-template #right>
        <tri-icon type="right" theme="outline" />
      </ng-template>
    </div>
  `,
  styles: [
    `
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
  ]
})
export class TriDemoFloatButtonGroupPlacementComponent {
  openChange(status: boolean): void {
    console.log(status);
  }
}
