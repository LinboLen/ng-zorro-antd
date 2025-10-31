import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule, TriInputSearchEvent } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-search-input',
  imports: [FormsModule, TriInputModule, TriIconModule],
  template: `
    <tri-input-search (search)="onSearch($event)">
      <input tri-input [(ngModel)]="value" placeholder="input search text" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search allowClear (search)="onSearch($event)">
      <input tri-input [(ngModel)]="value" placeholder="input search text" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search (search)="onSearch($event)">
      <span inputAddonBefore>https://</span>
      <input tri-input [(ngModel)]="value" placeholder="input search text" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search enterButton="Submit" (search)="onSearch($event)">
      <input tri-input [(ngModel)]="value" placeholder="input search text" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search enterButton="Submit" (search)="onSearch($event)">
      <input tri-input [(ngModel)]="value" placeholder="input search text" size="large" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search (search)="onSearch($event)">
      <input tri-input [(ngModel)]="value" placeholder="input search text" size="large" />
      <tri-icon inputSuffix type="audio" [style.font-size.px]="16" [style.color]="'#1677ff'" />
      <span inputSearchEnterButton>Custom</span>
    </tri-input-search>
  `
})
export class TriDemoInputSearchInputComponent {
  readonly value = signal('');

  onSearch(event: TriInputSearchEvent): void {
    console.log(event);
  }
}
