import { Component } from '@angular/core';

import { TriCalendarModule } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'tri-demo-calendar-customize-header',
  imports: [TriCalendarModule],
  template: `
    <div class="card">
      <tri-calendar [fullscreen]="false" [customHeader]="customHeader" />
    </div>

    <ng-template #customHeader>
      <div style="padding: 8px">
        <h4>Custom header</h4>
      </div>
    </ng-template>
  `,
  styles: `
    .card {
      width: 300px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
    }
  `
})
export class TriDemoCalendarCustomizeHeaderComponent {}
