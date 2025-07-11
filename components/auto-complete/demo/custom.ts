import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-custom',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="example-input">
      <textarea
        placeholder="input here"
        tri-input
        rows="4"
        [(ngModel)]="inputValue"
        (input)="onInput($event)"
        [autocomplete]="auto"
      ></textarea>
      <tri-autocomplete #auto>
        @for (option of options; track $index) {
          <tri-auto-option [value]="option">{{ option }}</tri-auto-option>
        }
      </tri-autocomplete>
    </div>
  `
})
export class TriDemoAutoCompleteCustomComponent {
  inputValue?: string;
  options: string[] = [];

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }
}
