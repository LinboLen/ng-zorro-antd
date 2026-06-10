import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-non-case-sensitive',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule],
  template: `
    <input placeholder='try to type "b"' tri-input [(ngModel)]="value" [autocomplete]="auto" />
    <tri-autocomplete [dataSource]="filteredOptions()" #auto />
  `
})
export class TriDemoAutoCompleteNonCaseSensitiveComponent {
  readonly value = signal<string>('');
  readonly options = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
  readonly filteredOptions = computed(() =>
    this.options.filter(option => option.toLowerCase().indexOf(this.value().toLowerCase()) !== -1)
  );
}
