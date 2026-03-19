import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriTabsModule, type TriIndicator, type TriIndicatorAlign } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-indicator',
  imports: [TriTabsModule, TriRadioModule, FormsModule],
  template: `
    <tri-radio-group buttonStyle="solid" [(ngModel)]="positionIndicator">
      <label tri-radio-button value="start">Start</label>
      <label tri-radio-button value="center">Center</label>
      <label tri-radio-button value="end">End</label>
    </tri-radio-group>
    <tri-tabs [indicator]="indicator()">
      <tri-tab title="Tab 1">Content of Tab Pane 1</tri-tab>
      <tri-tab title="Tab 2">Content of Tab Pane 2</tri-tab>
      <tri-tab title="Tab 3">Content of Tab Pane 3</tri-tab>
    </tri-tabs>
  `
})
export class TriDemoTabsIndicatorComponent {
  readonly positionIndicator = signal<TriIndicatorAlign>('start');

  protected readonly indicator = computed<TriIndicator>(() => ({
    size: origin => origin - 25,
    align: this.positionIndicator()
  }));
}
