import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'tri-demo-collapse-ghost',
  imports: [TriCollapseModule],
  template: `
    <tri-collapse ghost>
      @for (panel of panels; track panel) {
        <tri-collapse-panel [header]="panel.name" [active]="panel.active">
          <p style="margin:0;">
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
            guest in many households across the world.
          </p>
        </tri-collapse-panel>
      }
    </tri-collapse>
  `
})
export class TriDemoCollapseGhostComponent {
  readonly panels = [
    {
      active: true,
      name: 'This is panel header 1'
    },
    {
      active: false,
      name: 'This is panel header 2'
    },
    {
      active: false,
      name: 'This is panel header 3'
    }
  ];
}
