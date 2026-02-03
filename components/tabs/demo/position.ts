import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriTabPosition, TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-position',
  imports: [FormsModule, TriSelectModule, TriTabsModule],
  template: `
    <div style="margin-bottom: 16px;">
      Tab position:
      <tri-select [(ngModel)]="position" style="width: 80px;">
        @for (option of options; track option.value) {
          <tri-option [label]="option.label" [value]="option.value" />
        }
      </tri-select>
    </div>
    <tri-tabs [tabPosition]="position">
      @for (tab of tabs; track tab) {
        <tri-tab [title]="'Tab ' + tab">Content of tab {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsPositionComponent {
  position: TriTabPosition = 'top';
  tabs = [1, 2, 3];
  options = [
    { value: 'top', label: 'top' },
    { value: 'left', label: 'left' },
    { value: 'right', label: 'right' },
    { value: 'bottom', label: 'bottom' }
  ];
}
