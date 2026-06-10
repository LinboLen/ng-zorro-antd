import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-default-value',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select mode="multiple" placeHolder="Inserted are removed" [(ngModel)]="listOfSelectedValue">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option" />
      }
      @for (option of defaultOption; track option) {
        <tri-option [label]="option" [value]="option" hide />
      }
    </tri-select>
    <br />
    <br />
    <tri-select [(ngModel)]="value">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option" />
      }
      <tri-option label="Default Value" value="Default" hide />
    </tri-select>
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectDefaultValueComponent {
  readonly listOfOption = ['Option 01', 'Option 02'];
  readonly listOfSelectedValue = signal(['Default 01', 'Default 02']);
  readonly value = signal('Default');

  get defaultOption(): string[] {
    return this.listOfSelectedValue();
  }
}
