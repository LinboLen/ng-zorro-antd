import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-basic',
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
      <tri-autocomplete [dataSource]="options" backfill #auto></tri-autocomplete>
    </div>
  `
})
export class TriDemoAutoCompleteBasicComponent {
  inputValue?: string;
  options: string[] = [];

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }
}
