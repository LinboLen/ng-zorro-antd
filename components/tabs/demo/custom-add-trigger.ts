import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [TriButtonModule, TriTabsModule],
  template: `
    <div style="margin-bottom: 16px;">
      <button tri-button (click)="newTab()">ADD</button>
    </div>
    <tri-tabs [(selectedIndexChange)]="index" type="editable-card" hideAdd (close)="closeTab($event)">
      @for (tab of tabs; track tab; let i = $index) {
        <tri-tab [closable]="i > 1" [title]="tab">Content of {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsCustomAddTriggerComponent {
  index = 0;
  tabs = ['Tab 1', 'Tab 2'];

  closeTab({ index }: { index: number }): void {
    this.tabs.splice(index, 1);
  }

  newTab(): void {
    this.tabs.push('New Tab');
    this.index = this.tabs.length - 1;
  }
}
