import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';
import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'tri-demo-card-in-column',
  imports: [TriCardModule, TriGridModule],
  template: `
    <div style="background: #ECECEC; padding:30px;">
      <div tri-row [gutter]="8">
        <div tri-col [span]="8">
          <tri-card title="Card title">
            <p>Card content</p>
          </tri-card>
        </div>
        <div tri-col [span]="8">
          <tri-card title="Card title">
            <p>Card content</p>
          </tri-card>
        </div>
        <div tri-col [span]="8">
          <tri-card title="Card title">
            <p>Card content</p>
          </tri-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      p {
        margin: 0;
      }
    `
  ]
})
export class TriDemoCardInColumnComponent {}
