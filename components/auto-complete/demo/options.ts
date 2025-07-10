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
        placeholder="input here"
        tri-input
        [(ngModel)]="inputValue"
        (input)="onInput($event)"
        [autocomplete]="auto"
      />
      <tri-autocomplete #auto>
        @for (option of options; track $index) {
          <tri-auto-option [value]="option">{{ option }}</tri-auto-option>
        }
      </tri-autocomplete>
    </div>
  `
})
export class TriDemoAutoCompleteOptionsComponent {
  inputValue?: string;
  options: string[] = [];

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options = [];
    } else {
      this.options = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
  }
}
