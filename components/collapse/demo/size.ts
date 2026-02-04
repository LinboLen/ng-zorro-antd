import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';
import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'tri-demo-collapse-size',
  imports: [TriCollapseModule, TriDividerModule],
  template: `
    <tri-divider text="Default Size" orientation="left" />
    <tri-collapse>
      <tri-collapse-panel header="This is default size panel header" active>
        <p style="margin:0;">
          A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
          guest in many households across the world.
        </p>
      </tri-collapse-panel>
    </tri-collapse>
    <tri-divider text="Small Size" orientation="left" />
    <tri-collapse size="small">
      <tri-collapse-panel header="This is small size panel header" active>
        <p style="margin:0;">
          A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
          guest in many households across the world.
        </p>
      </tri-collapse-panel>
    </tri-collapse>
    <tri-divider text="Large Size" orientation="left" />
    <tri-collapse size="large">
      <tri-collapse-panel header="This is large size panel header" active>
        <p style="margin:0;">
          A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
          guest in many households across the world.
        </p>
      </tri-collapse-panel>
    </tri-collapse>
  `
})
export class TriDemoCollapseSizeComponent {}
