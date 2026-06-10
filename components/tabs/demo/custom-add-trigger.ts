import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-custom-add-trigger',
  imports: [TriButtonModule, TriTabsModule],
  template: `
    <div style="margin-bottom: 16px;">
      <button tri-button (click)="newTab()">ADD</button>
    </div>
    <tri-tabs [(selectedIndexChange)]="index" type="editable-card" hideAdd (close)="closeTab($event)">
      @for (tab of tabs(); track tab) {
        <tri-tab [closable]="$index > 1" [title]="tab">Content of {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsCustomAddTriggerComponent {
  readonly index = signal(0);
  readonly tabs = signal(['Tab 1', 'Tab 2']);

  closeTab({ index }: { index: number }): void {
    this.tabs.update(tabs => tabs.filter((_, i) => i !== index));
  }

  newTab(): void {
    this.tabs.update(tabs => [...tabs, 'New Tab']);
    this.index.set(this.tabs().length - 1);
  }
}
