import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'tri-demo-card-border-less',
  imports: [TriCardModule],
  template: `
    <div style="background: #ECECEC; padding:30px;">
      <tri-card style="width:300px;" [bordered]="false" title="Card title" [extra]="extraTemplate">
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </tri-card>
    </div>
    <ng-template #extraTemplate>
      <a>More</a>
    </ng-template>
  `,
  styles: [
    `
      p {
        margin: 0;
      }
    `
  ]
})
export class TriDemoCardBorderLessComponent {}
