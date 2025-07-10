import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select ngModel="lucy">
      <tri-option value="jack" label="Jack"></tri-option>
      <tri-option value="lucy" label="Lucy"></tri-option>
      <tri-option value="disabled" label="Disabled" disabled></tri-option>
    </tri-select>
    <tri-select ngModel="lucy" disabled>
      <tri-option value="lucy" label="Lucy"></tri-option>
    </tri-select>
    <tri-select ngModel="lucy" loading>
      <tri-option value="lucy" label="Lucy"></tri-option>
    </tri-select>
    <tri-select ngModel="lucy" allowClear placeHolder="Choose">
      <tri-option value="lucy" label="Lucy"></tri-option>
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        margin: 0 8px 10px 0;
        width: 120px;
      }
    `
  ]
})
export class TriDemoSelectBasicComponent {}
