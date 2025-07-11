import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';
import { TriSelectModule, TriSelectPlacementType } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-placement',
  imports: [FormsModule, TriRadioModule, TriSelectModule],
  template: `
    <tri-radio-group [(ngModel)]="placement">
      <label tri-radio-button value="topLeft">topLeft</label>
      <label tri-radio-button value="topRight">topRight</label>
      <label tri-radio-button value="bottomLeft">bottomLeft</label>
      <label tri-radio-button value="bottomRight">bottomRight</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-select [(ngModel)]="selectedValue" [dropdownMatchSelectWidth]="false" [placement]="placement">
      <tri-option value="HangZhou" label="HangZhou #310000"></tri-option>
      <tri-option value="NingBo" label="NingBo #315000"></tri-option>
      <tri-option value="WenZhou" label="WenZhou #325000"></tri-option>
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 120px;
      }
    `
  ]
})
export class TriDemoSelectPlacementComponent {
  placement: TriSelectPlacementType = 'topLeft';
  selectedValue = 'HangZhou';
}
