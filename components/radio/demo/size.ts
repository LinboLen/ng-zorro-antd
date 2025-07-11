import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-radio-size',
  imports: [FormsModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="radioValue" size="large">
      <label tri-radio-button value="A">Hangzhou</label>
      <label tri-radio-button value="B">Shanghai</label>
      <label tri-radio-button value="C">Beijing</label>
      <label tri-radio-button value="D">Chengdu</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-radio-group [(ngModel)]="radioValue">
      <label tri-radio-button value="A">Hangzhou</label>
      <label tri-radio-button value="B">Shanghai</label>
      <label tri-radio-button value="C">Beijing</label>
      <label tri-radio-button value="D">Chengdu</label>
    </tri-radio-group>
    <br />
    <br />
    <tri-radio-group [(ngModel)]="radioValue" size="small">
      <label tri-radio-button value="A">Hangzhou</label>
      <label tri-radio-button value="B">Shanghai</label>
      <label tri-radio-button value="C">Beijing</label>
      <label tri-radio-button value="D">Chengdu</label>
    </tri-radio-group>
  `
})
export class TriDemoRadioSizeComponent {
  radioValue = 'A';
}
