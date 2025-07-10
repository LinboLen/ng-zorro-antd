import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: '',
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio-button value="A">Hangzhou</label>
      <label tri-radio-button value="B">Shanghai</label>
      <label tri-radio-button value="C">Beijing</label>
      <label tri-radio-button value="D">Chengdu</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio-button value="A">Hangzhou</label>
      <label tri-radio-button value="B" disabled>Shanghai</label>
      <label tri-radio-button value="C">Beijing</label>
      <label tri-radio-button value="D">Chengdu</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio-button value="A" disabled>Hangzhou</label>
      <label tri-radio-button value="B" disabled>Shanghai</label>
      <label tri-radio-button value="C" disabled>Beijing</label>
      <label tri-radio-button value="D" disabled>Chengdu</label>
    </tri-radio-group>
  `
})
export class TriDemoRadioRadiobuttonComponent {
  radioValue = 'A';
}
