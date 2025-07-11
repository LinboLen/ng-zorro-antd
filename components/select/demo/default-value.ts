import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-default-value',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select mode="multiple" placeHolder="Inserted are removed" [(ngModel)]="listOfSelectedValue">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
      @for (option of defaultOption; track option) {
        <tri-option [label]="option" [value]="option" hide></tri-option>
      }
    </tri-select>
    <br />
    <br />
    <tri-select [(ngModel)]="selectedValue">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option"></tri-option>
      }
      <tri-option label="Default Value" value="Default" hide></tri-option>
    </tri-select>
  `,
  styles: [
    `
      nz-select {
        width: 100%;
      }
    `
  ]
})
export class TriDemoSelectDefaultValueComponent {
  listOfOption = ['Option 01', 'Option 02'];
  listOfSelectedValue = ['Default 01', 'Default 02'];
  defaultOption = [...this.listOfSelectedValue];
  selectedValue = 'Default';
}
