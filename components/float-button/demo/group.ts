import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-group',
  imports: [TriFloatButtonModule],
  template: `
    <div class="group">
      <tri-float-button-group shape="circle" style="right: 24px">
        <tri-float-button icon="question-circle"></tri-float-button>
        <tri-float-button></tri-float-button>
        <tri-float-button-top [visibilityHeight]="600"></tri-float-button-top>
        <tri-float-button icon="customer-service"></tri-float-button>
      </tri-float-button-group>
      <tri-float-button-group shape="square" style="right: 94px">
        <tri-float-button icon="question-circle"></tri-float-button>
        <tri-float-button></tri-float-button>
        <tri-float-button-top [visibilityHeight]="600"></tri-float-button-top>
        <tri-float-button icon="customer-service"></tri-float-button>
      </tri-float-button-group>
    </div>
  `,
  styles: [
    `
      .group {
        height: 300px;
        position: relative;
      }
      nz-float-button-group {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonGroupComponent {}
