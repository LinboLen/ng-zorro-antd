import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';
import { TriFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'tri-demo-collapse-collapsible',
  imports: [TriCollapseModule, TriFlexModule],
  template: `
    <div tri-flex vertical wrap="wrap" [gap]="16">
      <tri-collapse>
        <tri-collapse-panel header="This is panel with header collapsible" collapsible="header">
          <p style="margin:0;">
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
            guest in many households across the world.
          </p>
        </tri-collapse-panel>
      </tri-collapse>
      <tri-collapse>
        <tri-collapse-panel header="This is panel with icon collapsible" collapsible="icon">
          <p style="margin:0;">
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
            guest in many households across the world.
          </p>
        </tri-collapse-panel>
      </tri-collapse>
      <tri-collapse>
        <tri-collapse-panel header="This is panel with disabled collapsible" collapsible="disabled">
          <p style="margin:0;">
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
            guest in many households across the world.
          </p>
        </tri-collapse-panel>
      </tri-collapse>
    </div>
  `
})
export class TriDemoCollapseCollapsibleComponent {}
