import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select showSearch allowClear placeHolder="Select a person" [(ngModel)]="selectedValue">
      <tri-option label="Jack" value="jack"></tri-option>
      <tri-option label="Lucy" value="lucy"></tri-option>
      <tri-option label="Tom" value="tom"></tri-option>
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
export class TriDemoSelectSearchComponent {
  selectedValue = null;
}
