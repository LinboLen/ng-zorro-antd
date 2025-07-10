import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [TriIconModule, TriTabsModule],
  template: `
    <tri-tabs>
      @for (tab of tabs; track tab) {
        <tri-tab [title]="titleTemplate">
          <ng-template #titleTemplate>
            <tri-icon [type]="tab.icon" />
            {{ tab.name }}
          </ng-template>
          {{ tab.name }}
        </tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsIconComponent {
  tabs = [
    {
      name: 'Tab 1',
      icon: 'apple'
    },
    {
      name: 'Tab 2',
      icon: 'android'
    }
  ];
}
