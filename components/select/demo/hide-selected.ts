import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-select-hide-selected',
  imports: [FormsModule, TriSelectModule],
  template: `
    <tri-select mode="multiple" placeHolder="Inserted are removed" [(ngModel)]="listOfSelected">
      @for (option of listOfOption; track option) {
        <tri-option [label]="option" [value]="option" [hide]="!isSelected(option)" />
      }
    </tri-select>
  `,
  styles: `
    nz-select {
      width: 100%;
    }
  `
})
export class TriDemoSelectHideSelectedComponent {
  listOfOption = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
  listOfSelected: string[] = [];

  isSelected(value: string): boolean {
    return this.listOfSelected.indexOf(value) !== -1;
  }
}
