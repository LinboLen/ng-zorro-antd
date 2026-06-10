import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

interface Option {
  label: string;
  value: string;
  age: number;
}

@Component({
  selector: 'tri-demo-auto-complete-object-value',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  template: `
    <input placeholder="input here" tri-input [(ngModel)]="inputValue" [autocomplete]="auto" />
    <tri-autocomplete #auto [compareWith]="compareFn">
      @for (option of options; track $index) {
        <tri-auto-option [value]="option" [label]="option.label">
          {{ option.label }}
        </tri-auto-option>
      }
    </tri-autocomplete>
  `
})
export class TriDemoAutoCompleteObjectValueComponent {
  inputValue: Option = { label: 'Lucy', value: 'lucy', age: 20 };
  readonly options: Option[] = [
    { label: 'Lucy', value: 'lucy', age: 20 },
    { label: 'Jack', value: 'jack', age: 22 }
  ];
  readonly compareFn = (o1: Option | string, o2: Option): boolean => {
    if (o1) {
      return typeof o1 === 'string' ? o1 === o2.label : o1.value === o2.value;
    } else {
      return false;
    }
  };
}
