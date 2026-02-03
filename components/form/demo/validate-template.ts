import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-form-validate-template',
  imports: [FormsModule, TriFormModule, TriInputModule, TriInputModule],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-label [span]="5">Required</tri-form-label>
        <tri-form-control hasFeedback [span]="12" errorTip="Input is required">
          <input tri-input ngModel="Required Input" name="required" required />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">MaxLength</tri-form-label>
        <tri-form-control hasFeedback [span]="12" errorTip="MaxLength is 6">
          <input tri-input ngModel="MaxLength is 6" name="maxlength" maxlength="6" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">MinLength</tri-form-label>
        <tri-form-control hasFeedback [span]="12" errorTip="MinLength is 6">
          <input tri-input ngModel="MinLength is 6" name="minlength" minlength="6" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Email</tri-form-label>
        <tri-form-control hasFeedback [span]="12" errorTip="Email is not valid">
          <input tri-input ngModel="Input Email" name="email" email />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Pattern</tri-form-label>
        <tri-form-control hasFeedback [span]="12" errorTip="Pattern not match">
          <input tri-input ngModel="Match pattern" name="pattern" pattern=".{3,}" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Mix</tri-form-label>
        <tri-form-control hasFeedback [span]="12" [errorTip]="combineTpl">
          <input
            tri-input
            ngModel="MaxLength is 12 and MinLength is 6"
            name="mix"
            minlength="6"
            maxlength="12"
            required
          />
          <ng-template #combineTpl let-control>
            @if (control.errors?.['maxlength']) {
              MaxLength is 12
            }
            @if (control.errors?.['minlength']) {
              MinLength is 6
            }
            @if (control.errors?.['required']) {
              Input is required
            }
          </ng-template>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: `
    [nz-form] {
      max-width: 600px;
    }
  `
})
export class TriDemoFormValidateTemplateComponent {}
