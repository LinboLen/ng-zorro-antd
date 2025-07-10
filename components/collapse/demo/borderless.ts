import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: '',
  imports: [TriCollapseModule],
  template: `
    <tri-collapse [bordered]="false">
      @for (panel of panels; track panel) {
        <tri-collapse-panel [header]="panel.name" [active]="panel.active">
          <p>{{ panel.name }} content</p>
        </tri-collapse-panel>
      }
    </tri-collapse>
  `
})
export class TriDemoCollapseBorderlessComponent {
  panels = [
    {
      active: true,
      disabled: false,
      name: 'This is panel header 1',
      childPannel: [
        {
          active: false,
          disabled: true,
          name: 'This is panel header 1-1'
        }
      ]
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 2'
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 3'
    }
  ];
}
