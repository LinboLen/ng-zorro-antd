import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriInputModule } from 'ng-zorro-antd/input';
import { TriRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'tri-demo-radio-radiogroup-more',
  imports: [FormsModule, TriInputModule, TriRadioModule],
  template: `
    <tri-radio-group [(ngModel)]="value">
      <label tri-radio value="A">Option A</label>
      <label tri-radio value="B">Option B</label>
      <label tri-radio value="C">Option C</label>
      <label tri-radio value="M">
        More...
        @if (value() === 'M') {
          <input type="text" tri-input />
        }
      </label>
    </tri-radio-group>
  `,
  styles: `
    [nz-radio] {
      display: block;
      height: 32px;
      line-height: 32px;
    }

    input {
      width: 100px;
      margin-left: 10px;
    }
  `
})
export class TriDemoRadioRadiogroupMoreComponent {
  readonly value = signal('A');
}
