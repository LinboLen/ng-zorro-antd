import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'tri-demo-collapse-borderless',
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
