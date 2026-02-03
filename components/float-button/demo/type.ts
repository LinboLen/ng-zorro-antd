import { Component } from '@angular/core';

import { TriFloatButtonModule } from 'ng-zorro-antd/float-button';

@Component({
  selector: 'tri-demo-float-button-type',
  imports: [TriFloatButtonModule],
  template: `
    <div class="type">
      <tri-float-button type="primary" style="right: 24px" icon="question-circle" />
      <tri-float-button type="default" style="right: 94px" icon="question-circle" />
    </div>
  `,
  styles: `
    .type {
      height: 300px;
      position: relative;
    }
    nz-float-button {
      position: absolute;
    }
  `
})
export class TriDemoFloatButtonTypeComponent {}
