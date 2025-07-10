import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: '',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="example-input">
      <input
        placeholder='try to type "b"'
        tri-input
        [(ngModel)]="inputValue"
        (ngModelChange)="onChange($event)"
        [autocomplete]="auto"
      />
      <tri-autocomplete [dataSource]="filteredOptions" #auto></tri-autocomplete>
    </div>
  `
})
export class TriDemoAutoCompleteNonCaseSensitiveComponent {
  inputValue?: string;
  filteredOptions: string[] = [];
  options = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
  constructor() {
    this.filteredOptions = this.options;
  }
  onChange(value: string): void {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }
}
