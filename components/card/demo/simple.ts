import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'tri-demo-card-simple',
  imports: [TriCardModule],
  template: `
    <tri-card style="width:300px;">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </tri-card>
  `,
  styles: [
    `
      p {
        margin: 0;
      }
    `
  ]
})
export class TriDemoCardSimpleComponent {}
