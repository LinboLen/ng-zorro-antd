import { Component } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [TriTabsModule],
  template: `
    <tri-tabs>
      @for (tab of tabs; track tab) {
        <tri-tab [title]="tab.name" [disabled]="tab.disabled">
          {{ tab.name }}
        </tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsDisabledComponent {
  tabs = [
    {
      name: 'Tab 1',
      disabled: false
    },
    {
      name: 'Tab 2',
      disabled: true
    },
    {
      name: 'Tab 3',
      disabled: false
    }
  ];
}
