import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriTabPosition, TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-position',
  imports: [FormsModule, TriSelectModule, TriTabsModule],
  template: `
    <div>
      Tab position:
      <tri-select [options]="options" [(ngModel)]="position" style="width: 80px;" />
    </div>
    <br />
    <br />
    <tri-tabs [tabPosition]="position()">
      @for (tab of tabs; track tab) {
        <tri-tab title="Tab {{ tab }}">Content of tab {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsPositionComponent {
  readonly position = signal<TriTabPosition>('top');
  readonly tabs = [1, 2, 3];
  readonly options = [
    { value: 'top', label: 'top' },
    { value: 'left', label: 'left' },
    { value: 'right', label: 'right' },
    { value: 'bottom', label: 'bottom' }
  ];
}
