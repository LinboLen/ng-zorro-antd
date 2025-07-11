import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-date-picker-switch',
  imports: [FormsModule, TriDatePickerModule, TriSelectModule, TriSpaceModule],
  template: `
    <tri-space>
      <tri-select *spaceItem [(ngModel)]="mode">
        <tri-option value="date" label="Date"></tri-option>
        <tri-option value="week" label="Week"></tri-option>
        <tri-option value="month" label="Month"></tri-option>
        <tri-option value="quarter" label="Quarter"></tri-option>
        <tri-option value="year" label="Year"></tri-option>
      </tri-select>
      <tri-date-picker *spaceItem [mode]="mode"></tri-date-picker>
    </tri-space>
  `
})
export class TriDemoDatePickerSwitchComponent {
  mode = 'date';
}
