import { Component } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-editable-card',
  imports: [TriTabsModule],
  template: `
    <tri-tabs [(selectedIndexChange)]="selectedIndex" type="editable-card" (add)="newTab()" (close)="closeTab($event)">
      @for (tab of tabs; track tab) {
        <tri-tab closable [title]="tab">Content of {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsEditableCardComponent {
  tabs = ['Tab 1', 'Tab 2'];
  selectedIndex = 0;

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  newTab(): void {
    this.tabs.push('New Tab');
    this.selectedIndex = this.tabs.length;
  }
}
