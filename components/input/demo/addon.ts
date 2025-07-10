import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  imports: [FormsModule, TriInputModule, TriSelectModule],
  template: `
    <tri-input-group addOnBefore="Http://" addOnAfter=".com">
      <input type="text" tri-input [(ngModel)]="inputValue" />
    </tri-input-group>
    <br />
    <br />
    <tri-input-group [addOnBefore]="addOnBeforeTemplate" [addOnAfter]="addOnAfterTemplate">
      <input type="text" tri-input [(ngModel)]="inputValue" />
    </tri-input-group>
    <ng-template #addOnBeforeTemplate>
      <tri-select [ngModel]="'Http://'">
        <tri-option label="Http://" value="Http://"></tri-option>
        <tri-option label="Https://" value="Https://"></tri-option>
      </tri-select>
    </ng-template>
    <ng-template #addOnAfterTemplate>
      <tri-select [ngModel]="'.com'">
        <tri-option label=".com" value=".com"></tri-option>
        <tri-option label=".jp" value=".jp"></tri-option>
        <tri-option label=".cn" value=".cn"></tri-option>
        <tri-option label=".org" value=".org"></tri-option>
      </tri-select>
    </ng-template>
    <br />
    <br />
    <tri-input-group addOnAfterIcon="setting">
      <input type="text" tri-input [(ngModel)]="inputValue" />
    </tri-input-group>
  `
})
export class TriDemoInputAddonComponent {
  inputValue: string = 'my site';
}
