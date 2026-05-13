import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-mix-layout',
  imports: [TriDividerModule, TriFormModule, TriInputModule],
  template: `
    <form tri-form layout="horizontal">
      <tri-form-item>
        <tri-form-label [span]="4">horizontal</tri-form-label>
        <tri-form-control [span]="20">
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item layout="vertical">
        <tri-form-label>vertical</tri-form-label>
        <tri-form-control>
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item layout="vertical">
        <tri-form-label>vertical2</tri-form-label>
        <tri-form-control>
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
    </form>

    <tri-divider />

    <form tri-form layout="vertical">
      <tri-form-item>
        <tri-form-label>vertical</tri-form-label>
        <tri-form-control>
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label>vertical2</tri-form-label>
        <tri-form-control>
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item layout="horizontal">
        <tri-form-label [span]="4">horizontal</tri-form-label>
        <tri-form-control [span]="20">
          <input tri-input />
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: `
    form {
      max-width: 600px;
    }
  `
})
export class TriDemoFormMixLayoutComponent {}
