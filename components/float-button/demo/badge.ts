import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-badge',
  imports: [TriFloatButtonModule],
  template: `
    <div class="group">
      <tri-float-button shape="circle" [badge]="{ nzDot: true }" style="inset-inline-end: 164px"></tri-float-button>
      <tri-float-button-group shape="circle" style="inset-inline-end: 94px">
        <tri-float-button [badge]="{ nzCount: 5, nzColor: 'blue' }"></tri-float-button>
        <tri-float-button [badge]="{ nzCount: 5 }"></tri-float-button>
      </tri-float-button-group>
      <tri-float-button-group shape="circle">
        <tri-float-button [badge]="{ nzCount: 12 }" icon="question-circle"></tri-float-button>
        <tri-float-button [badge]="{ nzCount: 123, nzOverflowCount: 999 }"></tri-float-button>
        <tri-float-button-top [visibilityHeight]="0" [badge]="{ nzDot: true }"></tri-float-button-top>
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
      nz-float-button {
        position: absolute;
      }
    `
  ]
})
export class TriDemoFloatButtonBadgeComponent {}
