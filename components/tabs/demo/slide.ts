import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTabPosition, TriTabsModule } from 'ng-zorro-antd/tabs';

interface Tab {
  name: string;
  content: string;
  disabled: boolean;
}

@Component({
  selector: 'tri-demo-tabs-slide',
  imports: [FormsModule, TriInputNumberModule, TriRadioModule, TriTabsModule],
  template: `
    <tri-radio-group [(ngModel)]="position" style="margin-bottom: 8px;">
      <label tri-radio-button value="top">Horizontal</label>
      <label tri-radio-button value="left">Vertical</label>
    </tri-radio-group>
    <tri-input-number style="float:right;" [min]="0" [max]="29" [(ngModel)]="selectedIndex" />

    <tri-tabs
      style="height:220px;"
      [tabPosition]="position()"
      [(selectedIndexChange)]="selectedIndex"
      (selectChange)="log([$event])"
    >
      @for (tab of tabs(); track tab) {
        <tri-tab
          [title]="tab.name"
          [disabled]="tab.disabled"
          (select)="log(['select', tab])"
          (click)="log(['click', tab])"
          (contextmenu)="log(['contextmenu', tab])"
          (deselect)="log(['deselect', tab])"
        >
          {{ tab.content }}
        </tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsSlideComponent implements OnInit {
  readonly tabs = signal<Tab[]>([]);
  readonly position = signal<TriTabPosition>('top');
  readonly selectedIndex = signal(27);

  log(args: unknown[]): void {
    console.log(args);
  }

  ngOnInit(): void {
    const tabs: Tab[] = [];
    for (let i = 0; i < 30; i++) {
      tabs.push({
        name: `Tab ${i}`,
        disabled: i === 28,
        content: `Content of tab ${i}`
      });
    }
    this.tabs.set(tabs);
  }
}
