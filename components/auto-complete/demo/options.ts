import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-options',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  template: `
    <input placeholder="input here" tri-input [(ngModel)]="value" (input)="onInput($event)" [autocomplete]="auto" />
    <tri-autocomplete #auto>
      @for (option of options(); track $index) {
        <tri-auto-option [value]="option">{{ option }}</tri-auto-option>
      }
    </tri-autocomplete>
  `
})
export class TriDemoAutoCompleteOptionsComponent {
  value?: string;
  readonly options = signal<string[]>([]);

  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    if (!value || value.indexOf('@') >= 0) {
      this.options.set([]);
    } else {
      this.options.set(['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`));
    }
  }
}
