import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-custom-origin',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  template: `
    <tri-input-wrapper autocompleteOrigin #origin="nzAutocompleteOrigin" suffix="RMB" style="width: 300px">
      <input
        tri-input
        placeholder="input here"
        [(ngModel)]="inputValue"
        [autocomplete]="auto"
        [autocompleteConnectedTo]="origin"
        (input)="onInput($event)"
      />
    </tri-input-wrapper>
    <tri-autocomplete #auto>
      @for (option of options(); track option) {
        <tri-auto-option [value]="option">{{ option }}</tri-auto-option>
      }
    </tri-autocomplete>
  `
})
export class TriDemoAutoCompleteCustomOriginComponent {
  inputValue = '';
  readonly options = signal<string[]>([]);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options.set(value ? [value, value + value, value + value + value] : []);
  }
}
