import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: '',
  imports: [TriIconModule, TriSpinModule],
  template: `
    <ng-template #indicatorTemplate><tri-icon type="loading" /></ng-template>
    <tri-spin simple [indicator]="indicatorTemplate"></tri-spin>
  `,
  styles: [
    `
      nz-icon {
        font-size: 24px;
      }
    `
  ]
})
export class TriDemoSpinCustomIndicatorComponent {}
