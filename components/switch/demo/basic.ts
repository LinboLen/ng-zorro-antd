import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-basic',
  imports: [FormsModule, TriSwitchModule],
  template: `<tri-switch [(ngModel)]="switchValue" />`
})
export class TriDemoSwitchBasicComponent {
  switchValue = false;
}
