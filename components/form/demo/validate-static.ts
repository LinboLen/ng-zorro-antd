import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDatePickerModule } from 'ng-zorro-antd/date-picker';
import { TriFormModule } from 'ng-zorro-antd/form';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriInputNumberModule } from 'ng-zorro-antd/input-number';
import { TriSelectModule } from 'ng-zorro-antd/select';
import { TriTimePickerModule } from 'ng-zorro-antd/time-picker';

@Component({
  selector: 'tri-demo-form-validate-static',
  imports: [
    FormsModule,
    TriDatePickerModule,
    TriFormModule,
    TriInputModule,
    TriInputNumberModule,
    TriSelectModule,
    TriTimePickerModule
  ],
  template: `
    <form tri-form>
      <tri-form-item>
        <tri-form-label [span]="5">Fail</tri-form-label>
        <tri-form-control
          validateStatus="error"
          [span]="12"
          errorTip="Should be combination of numbers & alphabets"
        >
          <input tri-input [ngModel]="'unavailable choice'" name="errorValid" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Warning</tri-form-label>
        <tri-form-control validateStatus="warning" [span]="12">
          <input tri-input [ngModel]="'Warning'" name="warningValid" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Validating</tri-form-label>
        <tri-form-control
          [span]="12"
          validateStatus="validating"
          hasFeedback
          validatingTip="I'm validating the content"
        >
          <input tri-input [ngModel]="'The content is being validated'" name="validating" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Success</tri-form-label>
        <tri-form-control [span]="12" validateStatus="success" hasFeedback>
          <input tri-input [ngModel]="'The content'" name="successValid" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Warning</tri-form-label>
        <tri-form-control
          [span]="12"
          validateStatus="warning"
          hasFeedback
          warningTip="Should be combination of numbers & alphabets"
        >
          <input tri-input [ngModel]="'Warning'" name="warningHighValid" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Fail</tri-form-label>
        <tri-form-control
          [span]="12"
          validateStatus="error"
          hasFeedback
          errorTip="Should be combination of numbers & alphabets"
        >
          <input tri-input [ngModel]="'unavailable choice'" name="invalidValid" />
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Success</tri-form-label>
        <tri-form-control [span]="12" validateStatus="success" hasFeedback>
          <tri-date-picker name="date-picker-success"></tri-date-picker>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Warning</tri-form-label>
        <tri-form-control [span]="12" validateStatus="warning" hasFeedback>
          <tri-time-picker name="time-picker-warning"></tri-time-picker>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Error</tri-form-label>
        <tri-form-control [span]="12" validateStatus="error" hasFeedback>
          <tri-select name="select-error" [ngModel]="'Option 1'">
            <tri-option value="Option 1" label="Option 1"></tri-option>
            <tri-option value="Option 2" label="Option 2"></tri-option>
          </tri-select>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Validating</tri-form-label>
        <tri-form-control [span]="12" validateStatus="validating" hasFeedback>
          <tri-select name="select-validate" [ngModel]="'Option 2'">
            <tri-option value="Option 1" label="Option 1"></tri-option>
            <tri-option value="Option 2" label="Option 2"></tri-option>
          </tri-select>
        </tri-form-control>
      </tri-form-item>
      <tri-form-item>
        <tri-form-label [span]="5">Success</tri-form-label>
        <tri-form-control [span]="12" validateStatus="success" hasFeedback>
          <tri-input-number name="inputnumber-success" style="width:100%"></tri-input-number>
        </tri-form-control>
      </tri-form-item>
    </form>
  `,
  styles: [
    `
      [nz-form] {
        max-width: 600px;
      }

      nz-date-picker ::ng-deep .ant-calendar-picker {
        width: 100%;
      }

      nz-date-picker,
      nz-time-picker {
        width: 100%;
      }
    `
  ]
})
export class TriDemoFormValidateStaticComponent {}
