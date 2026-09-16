import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTabPosition, TriTabsModule } from 'ng-zorro-antd/tabs';

interface Tab {
  name: string;
  content: string;
  disabled: boolean;
}

@Component({
  selector: 'tri-demo-tabs-slide',
  imports: [FormsModule, TriRadioModule, TriTabsModule],
  template: `
    <tri-radio-group [(ngModel)]="position" style="margin-bottom: 8px;">
      <label tri-radio-button value="top">Horizontal</label>
      <label tri-radio-button value="left">Vertical</label>
    </tri-radio-group>

    <tri-tabs style="height:220px;" [tabPosition]="position()" [(selectedIndexChange)]="selectedIndex">
      @for (tab of tabs; track tab) {
        <tri-tab [title]="tab.name" [disabled]="tab.disabled">
          {{ tab.content }}
        </tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsSlideComponent {
  readonly tabs = Array.from({ length: 30 }, (_, i): Tab => ({
    name: `Tab ${i}`,
    disabled: i === 28,
    content: `Content of tab ${i}`
  }));
  readonly position = signal<TriTabPosition>('top');
  readonly selectedIndex = signal(27);
}
