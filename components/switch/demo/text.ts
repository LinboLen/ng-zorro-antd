import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-switch-text',
  imports: [FormsModule, TriIconModule, TriSwitchModule],
  template: `
    <tri-switch [ngModel]="true" checkedChildren="开" unCheckedChildren="关"></tri-switch>
    <br />
    <br />
    <tri-switch [ngModel]="false" checkedChildren="1" unCheckedChildren="0"></tri-switch>
    <br />
    <br />
    <tri-switch
      [ngModel]="true"
      [checkedChildren]="checkedTemplate"
      [unCheckedChildren]="unCheckedTemplate"
    ></tri-switch>
    <ng-template #checkedTemplate><tri-icon type="check" /></ng-template>
    <ng-template #unCheckedTemplate><tri-icon type="close" /></ng-template>
  `
})
export class TriDemoSwitchTextComponent {}
