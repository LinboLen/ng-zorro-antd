import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: '',
  imports: [TriCardModule],
  template: `
    <tri-card title="Cart Title">
      <div tri-card-grid>Content</div>
      <div tri-card-grid>Content</div>
      <div tri-card-grid>Content</div>
      <div tri-card-grid>Content</div>
      <div tri-card-grid>Content</div>
      <div tri-card-grid>Content</div>
      <div tri-card-grid>Content</div>
    </tri-card>
  `,
  styles: [
    `
      [nz-card-grid] {
        width: 25%;
        text-align: center;
      }
    `
  ]
})
export class TriDemoCardGridCardComponent {}
