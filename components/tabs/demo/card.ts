import { Component } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-card',
  imports: [TriTabsModule],
  template: `
    <tri-tabs type="card">
      @for (tab of tabs; track tab) {
        <tri-tab [title]="'Tab' + tab">Content of Tab Pane {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsCardComponent {
  tabs = [1, 2, 3];
}
