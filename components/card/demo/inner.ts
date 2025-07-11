import { Component } from '@angular/core';

import { TriCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'tri-demo-card-inner',
  imports: [TriCardModule],
  template: `
    <tri-card title="Card Title">
      <p style="font-size:14px;color:rgba(0, 0, 0, 0.85);margin-bottom:16px;font-weight: 500;">Group title</p>
      <tri-card type="inner" title="Inner Card Title" [extra]="extraTemplate">
        <a>Inner Card Content</a>
      </tri-card>
      <tri-card type="inner" style="margin-top:16px;" title="Inner Card Title" [extra]="extraTemplate">
        <a>Inner Card Content</a>
      </tri-card>
    </tri-card>
    <ng-template #extraTemplate>
      <a>More</a>
    </ng-template>
  `
})
export class TriDemoCardInnerComponent {}
