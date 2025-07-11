import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-float-button-group',
  imports: [TriFloatButtonModule, TriIconModule],
  template: `
    <div class="group">
      <tri-float-button-group shape="circle" style="right: 24px">
        <tri-float-button [icon]="icon"></tri-float-button>
        <tri-float-button></tri-float-button>
        <tri-float-button-top [visibilityHeight]="600"></tri-float-button-top>
        <tri-float-button [icon]="customer"></tri-float-button>
      </tri-float-button-group>
      <tri-float-button-group shape="square" style="right: 94px">
        <tri-float-button [icon]="icon"></tri-float-button>
        <tri-float-button></tri-float-button>
        <tri-float-button-top [visibilityHeight]="600"></tri-float-button-top>
        <tri-float-button [icon]="customer"></tri-float-button>
      </tri-float-button-group>
    </div>
    <ng-template #icon>
      <tri-icon type="question-circle" theme="outline"></tri-icon>
    </ng-template>
    <ng-template #customer>
      <tri-icon type="customer-service" theme="outline"></tri-icon>
    </ng-template>
  `,
  styles: [
    `
      .group {
        height: 300px;
        position: relative;
      }
      nz-float-button-group,
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonGroupComponent {}
