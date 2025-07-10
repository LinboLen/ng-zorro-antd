import { Component } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [TriTabsModule],
  template: `
    <tri-tabs centered>
      <tri-tab title="Tab 1">Content of Tab Pane 1</tri-tab>
      <tri-tab title="Tab 2">Content of Tab Pane 2</tri-tab>
      <tri-tab title="Tab 3">Content of Tab Pane 3</tri-tab>
    </tri-tabs>
  `
})
export class TriDemoTabsCenteredComponent {}
