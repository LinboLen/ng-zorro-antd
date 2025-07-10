import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: '',
  imports: [FormsModule, TriIconModule, TriInputModule, TriSpaceModule],
  template: `
    <tri-space direction="vertical" style="width: 100%">
      <input *spaceItem tri-input placeholder="Error" [(ngModel)]="value" status="error" />
      <input *spaceItem tri-input placeholder="Warning" [(ngModel)]="value" status="warning" />
      <tri-input-group *spaceItem [prefix]="prefixTemplateClock" status="error">
        <input type="text" tri-input placeholder="Error with prefix" />
      </tri-input-group>
      <tri-input-group *spaceItem [prefix]="prefixTemplateClock" status="warning">
        <input type="text" tri-input placeholder="Warning with prefix" />
      </tri-input-group>
      <ng-template #prefixTemplateClock>
        <tri-icon type="clock-circle" theme="outline" />
      </ng-template>
    </tri-space>
  `
})
export class TriDemoInputStatusComponent {
  value?: string;
}
