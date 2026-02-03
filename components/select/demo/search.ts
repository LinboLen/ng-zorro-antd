import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-search',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select showSearch allowClear placeHolder="Select a person" [(ngModel)]="selectedValue">
      <tri-option label="Jack" value="jack" />
      <tri-option label="Lucy" value="lucy" />
      <tri-option label="Tom" value="tom" />
    </tri-select>
  `,
  styles: `
    nz-select {
      width: 200px;
    }
  `
})
export class TriDemoSelectSearchComponent {
  selectedValue = null;
}
