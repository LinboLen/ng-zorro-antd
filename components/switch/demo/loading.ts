import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-loading',
  imports: [FormsModule, TriSwitchModule],
  template: `
    <tri-switch [ngModel]="true" loading></tri-switch>
    <br />
    <br />
    <tri-switch size="small" [ngModel]="false" loading></tri-switch>
  `
})
export class TriDemoSwitchLoadingComponent {}
