import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-size',
  imports: [FormsModule, TriSwitchModule],
  template: `
    <tri-switch [ngModel]="true" />
    <br />
    <br />
    <tri-switch size="small" [ngModel]="true" />
  `
})
export class TriDemoSwitchSizeComponent {}
