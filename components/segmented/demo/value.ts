import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

@Component({
  selector: '',
  imports: [FormsModule, TriSegmentedModule],
  template: `
    <tri-segmented [options]="options" [(ngModel)]="selectedValue" (ngModelChange)="handleModelChange($event)" />
    <br />
    Selected value: {{ selectedValue }}
  `,
  styles: [
    `
      .ant-segmented {
        margin-bottom: 10px;
      }
    `
  ]
})
export class TriDemoSegmentedValueComponent {
  selectedValue = 'Weekly';
  options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  handleModelChange(value: string): void {
    console.log(value);
  }
}
