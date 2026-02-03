import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-basic',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select ngModel="lucy">
      <tri-option value="jack" label="Jack" />
      <tri-option value="lucy" label="Lucy" />
      <tri-option value="disabled" label="Disabled" disabled />
    </tri-select>
    <tri-select ngModel="lucy" disabled>
      <tri-option value="lucy" label="Lucy" />
    </tri-select>
    <tri-select ngModel="lucy" loading>
      <tri-option value="lucy" label="Lucy" />
    </tri-select>
    <tri-select ngModel="lucy" allowClear placeHolder="Choose">
      <tri-option value="lucy" label="Lucy" />
    </tri-select>
  `,
  styles: `
    nz-select {
      margin: 0 8px 10px 0;
      width: 120px;
    }
  `
})
export class TriDemoSelectBasicComponent {}
