import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAlertModule } from 'ng-zorro-antd/alert';
import { TriSpinModule } from 'ng-zorro-antd/spin';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-spin-delay-and-debounce',
  imports: [FormsModule, TriAlertModule, TriSpinModule, TriSwitchModule],
  template: `
    <tri-spin [spinning]="isSpinning" [delay]="500">
      <tri-alert
        type="info"
        message="Alert message title"
        description="Further details about the context of this alert."
      ></tri-alert>
    </tri-spin>
    <br />
    <div>
      Loading state：
      <tri-switch [(ngModel)]="isSpinning"></tri-switch>
    </div>
  `
})
export class TriDemoSpinDelayAndDebounceComponent {
  isSpinning = false;
}
