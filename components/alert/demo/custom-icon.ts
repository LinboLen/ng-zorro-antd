import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'tri-demo-alert-custom-icon',
  imports: [TriAlertModule],
  template: `
    <tri-alert
      type="success"
      message="Success Tips"
      description="Detailed description and advices about successful copywriting."
      [icon]="customIconTemplate"
      showIcon
    />

    <ng-template #customIconTemplate>
      <div> S </div>
    </ng-template>
  `
})
export class TriDemoAlertCustomIconComponent {}
