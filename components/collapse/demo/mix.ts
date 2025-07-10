import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: '',
  imports: [TriCollapseModule],
  template: `
    <tri-collapse>
      @for (panel of panels; track panel) {
        <tri-collapse-panel [header]="panel.name" [active]="panel.active">
          <p>{{ panel.name }}</p>
          @if (panel.childPanel && panel.childPanel.length > 0) {
            <div>
              <tri-collapse>
                @for (childPanel of panel.childPanel; track childPanel) {
                  <tri-collapse-panel [header]="childPanel.name" [active]="childPanel.active">
                    <p>
                      A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as
                      a welcome guest in many households across the world.
                    </p>
                  </tri-collapse-panel>
                }
              </tri-collapse>
            </div>
          }
        </tri-collapse-panel>
      }
    </tri-collapse>
  `
})
export class TriDemoCollapseMixComponent {
  panels = [
    {
      active: true,
      disabled: false,
      name: 'This is panel header 1',
      childPanel: [
        {
          active: true,
          name: 'This is panel header 1-1'
        },
        {
          active: false,
          name: 'This is panel header 1-2'
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
