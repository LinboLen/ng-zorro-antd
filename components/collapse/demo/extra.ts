import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-collapse-extra',
  imports: [FormsModule, TriCollapseModule, TriIconModule, TriSelectModule],
  template: `
    <tri-collapse [expandIconPosition]="expandIconPosition">
      @for (panel of panels; track panel) {
        <tri-collapse-panel
          [header]="panel.name"
          [active]="panel.active"
          [extra]="extraTpl"
          [disabled]="panel.disabled"
        >
          <p style="margin:0;">
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
            guest in many households across the world.
          </p>
        </tri-collapse-panel>
      }
    </tri-collapse>
    <ng-template #extraTpl>
      <!-- You can use stopPropagation if you don't want the panel to toggle -->
      <tri-icon type="setting" (click)="$event.stopPropagation()" />
    </ng-template>
    <br />
    <span>Expand Icon Position: </span>
    <tri-select [(ngModel)]="expandIconPosition">
      <tri-option value="start" label="start" />
      <tri-option value="end" label="end" />
    </tri-select>
  `
})
export class TriDemoCollapseExtraComponent {
  expandIconPosition: 'start' | 'end' = 'start';

  panels = [
    {
      active: true,
      name: 'This is panel header 1',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 3'
    }
  ];
}
