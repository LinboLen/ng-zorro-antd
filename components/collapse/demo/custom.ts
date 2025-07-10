import { Component } from '@angular/core';

import { TriCollapseModule } from 'ng-zorro-antd/collapse';
import { TriIconModule } from 'ng-zorro-antd/icon';

interface Panel {
  active: boolean;
  disabled: boolean;
  name: string;
  icon?: string;
}

@Component({
  selector: '',
  imports: [TriIconModule, TriCollapseModule],
  template: `
    <tri-collapse [bordered]="false">
      @for (panel of panels; track panel) {
        <tri-collapse-panel
          #p
          [header]="panel.name"
          [active]="panel.active"
          [style]="customStyle"
          [expandedIcon]="!$first ? panel.icon || expandedIcon : undefined"
        >
          <p>{{ panel.name }} content</p>
          <ng-template #expandedIcon let-active>
            {{ active }}
            <tri-icon type="caret-right" class="tri-collapse-arrow" [rotate]="active ? 90 : -90" />
          </ng-template>
        </tri-collapse-panel>
      }
    </tri-collapse>
  `
})
export class TriDemoCollapseCustomComponent {
  readonly panels: Panel[] = [
    {
      active: true,
      disabled: false,
      name: 'This is panel header 1'
    },
    {
      active: false,
      disabled: true,
      name: 'This is panel header 2',
      icon: 'double-right'
    },
    {
      active: false,
      disabled: false,
      name: 'This is panel header 3'
    }
  ];
  readonly customStyle = {
    background: '#f7f7f7',
    'border-radius': '4px',
    'margin-bottom': '24px',
    border: '0px'
  };
}
