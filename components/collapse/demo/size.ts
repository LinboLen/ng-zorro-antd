import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';
import { TriFlexModule } from 'ng-zorro-antd/flex';

type Size = 'small' | 'middle' | 'large';

@Component({
  selector: 'tri-demo-collapse-size',
  template: `
    <div tri-flex wrap="wrap" vertical [gap]="8">
      <tri-collapse>
        <tri-collapse-panel header="This is the default panel size" active>
          <p style="margin:0;">
            A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
            guest in many households across the world.
          </p>
        </tri-collapse-panel>
      </tri-collapse>
      @for (panel of panels; track panel) {
        <tri-collapse [size]="panel.size">
          <tri-collapse-panel [header]="panel.name" [active]="panel.active">
            <p style="margin:0;">
              A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a
              welcome guest in many households across the world.
            </p>
          </tri-collapse-panel>
        </tri-collapse>
      }
    </div>
  `,
  imports: [TriCollapseModule, TriFlexModule]
})
export class TriDemoCollapseSizeComponent {
  panels = [
    {
      active: true,
      name: 'This is the small panel size',
      size: 'small' as Size
    },
    {
      active: true,
      name: 'This is the large panel size',
      size: 'large' as Size
    }
  ];
}
