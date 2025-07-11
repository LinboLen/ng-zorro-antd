import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-custom-content',
  imports: [FormsModule, TriIconModule, TriSelectModule],
  template: `
    <tri-select showSearch allowClear placeHolder="Select OS" [(ngModel)]="selectedValue">
      <tri-option customContent label="Windows" value="windows">
        <tri-icon type="windows" />
        Windows
      </tri-option>
      <tri-option customContent label="Mac" value="mac">
        <tri-icon type="apple" />
        Mac
      </tri-option>
      <tri-option customContent label="Android" value="android">
        <tri-icon type="android" />
        Android
      </tri-option>
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 200px;
      }
    `
  ]
})
export class TriDemoSelectCustomContentComponent {
  selectedValue = null;
}
