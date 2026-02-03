import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAlertModule } from 'ng-zorro-antd/alert';
import { TriSpinModule } from 'ng-zorro-antd/spin';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-spin-nested',
  imports: [FormsModule, TriAlertModule, TriSpinModule, TriSwitchModule],
  template: `
    <tri-spin [spinning]="isSpinning">
      <tri-alert
        type="info"
        message="Alert message title"
        description="Further details about the context of this alert."
      />
    </tri-spin>
    <br />
    <div>
      Loading state：
      <tri-switch [(ngModel)]="isSpinning" />
    </div>
  `
})
export class TriDemoSpinNestedComponent {
  isSpinning = false;
}
