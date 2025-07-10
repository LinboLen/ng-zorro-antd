import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriSwitchModule],
  template: `<tri-switch [(ngModel)]="switchValue"></tri-switch>`
})
export class TriDemoSwitchBasicComponent {
  switchValue = false;
}
