import { Component, signal } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-editable-card',
  imports: [TriTabsModule],
  template: `
    <tri-tabs [(selectedIndexChange)]="selectedIndex" type="editable-card" (add)="newTab()" (close)="closeTab($event)">
      @for (tab of tabs(); track tab) {
        <tri-tab closable [title]="tab">Content of {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsEditableCardComponent {
  readonly tabs = signal(['Tab 1', 'Tab 2']);
  readonly selectedIndex = signal(0);

  closeTab({ index }: { index: number }): void {
    this.tabs.update(tabs => tabs.filter((_, i) => i !== index));
  }

  newTab(): void {
    this.tabs.update(tabs => [...tabs, 'New Tab']);
    this.selectedIndex.set(this.tabs().length);
  }
}
