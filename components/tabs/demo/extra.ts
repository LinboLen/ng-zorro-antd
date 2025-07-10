import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: '',
  imports: [TriButtonModule, TriTabsModule, TriCheckboxModule, FormsModule],
  template: `
    <tri-tabs [tabBarExtraContent]="extraTemplate">
      @for (tab of tabs; track tab) {
        <tri-tab [title]="'Tab ' + tab">Content of tab {{ tab }}</tri-tab>
      }
    </tri-tabs>
    <ng-template #extraTemplate>
      <button tri-button>Extra Action</button>
    </ng-template>

    <br />
    <br />
    <p>You can also specify its direction or both side</p>
    <br />
    <tri-checkbox-group [options]="positionOptions" [(ngModel)]="positions" />
    <br />
    <br />

    <tri-tabs>
      @if (positions.includes('start')) {
        <button *tabBarExtraContent="'start'" tri-button [style.margin-right.px]="16">Start Extra Action</button>
      }
      @if (positions.includes('end')) {
        <button *tabBarExtraContent="'end'" tri-button [style.margin-left.px]="16">End Extra Action</button>
      }

      @for (tab of tabs; track tab) {
        <tri-tab [title]="'Tab ' + tab">Content of tab {{ tab }}</tri-tab>
      }
    </tri-tabs>
  `
})
export class TriDemoTabsExtraComponent {
  tabs = [1, 2, 3];
  positionOptions = [
    { label: 'start', value: 'start' },
    { label: 'end', value: 'end' }
  ];
  positions = ['start', 'end'];
}
