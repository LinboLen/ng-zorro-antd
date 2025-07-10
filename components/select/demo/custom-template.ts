import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  imports: [TriIconModule, TriSelectModule],
  template: `
    <tri-select allowClear placeHolder="Select OS" [customTemplate]="defaultTemplate">
      <tri-option label="Windows" value="windows"></tri-option>
      <tri-option label="Apple" value="apple"></tri-option>
      <tri-option label="Android" value="android"></tri-option>
    </tri-select>
    <ng-template #defaultTemplate let-selected>
      <tri-icon [type]="value" />
      {{ selected.nzLabel }}
    </ng-template>
    <br />
    <br />
    <tri-select allowClear placeHolder="Select OS" mode="multiple" [customTemplate]="multipleTemplate">
      <tri-option label="Windows" value="windows"></tri-option>
      <tri-option label="Apple" value="apple"></tri-option>
      <tri-option label="Android" value="android"></tri-option>
    </tri-select>
    <ng-template #multipleTemplate let-selected>
      <div class="tri-select-selection-item-content">
        <tri-icon [type]="value" />
        {{ selected.nzLabel }}
      </div>
    </ng-template>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectCustomTemplateComponent {}
