import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-basic',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  template: `
    <input
      placeholder="input here"
      tri-input
      [(ngModel)]="inputValue"
      (input)="onInput($event)"
      [autocomplete]="auto"
    />
    <tri-autocomplete [dataSource]="option()" backfill #auto />
  `
})
export class TriDemoAutoCompleteBasicComponent {
  inputValue?: string;
  readonly option = signal<string[]>([]);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.option.set(value ? [value, value + value, value + value + value] : []);
  }
}
