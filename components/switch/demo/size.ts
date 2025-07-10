import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriSwitchModule],
  template: `
    <tri-switch [ngModel]="true"></tri-switch>
    <br />
    <br />
    <tri-switch size="small" [ngModel]="true"></tri-switch>
  `
})
export class TriDemoSwitchSizeComponent {}
