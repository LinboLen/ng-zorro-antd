import { Component } from '@angular/core';

import { TriAlertModule } from 'ng-zorro-antd/alert';
import { TriSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: '',
  imports: [TriAlertModule, TriSpinModule],
  template: `
    <tri-spin tip="Loading...">
      <tri-alert
        type="info"
        message="Alert message title"
        description="Further details about the context of this alert."
      ></tri-alert>
    </tri-spin>
  `
})
export class TriDemoSpinTipComponent {}
