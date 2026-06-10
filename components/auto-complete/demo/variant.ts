import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriVariant } from 'ng-zorro-antd/core/types';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-variant',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule, TriFlexModule],
  template: `
    <tri-flex vertical gap="1rem">
      @for (variant of variants; track variant) {
        <input
          placeholder="input here"
          tri-input
          [(ngModel)]="value"
          (input)="onInput($event)"
          [autocomplete]="auto"
          [variant]="variant"
        />
        <tri-autocomplete [dataSource]="options()" backfill #auto />
      }
    </tri-flex>
  `
})
export class TriDemoAutoCompleteVariantComponent {
  value?: string;
  readonly variants: TriVariant[] = ['outlined', 'filled', 'borderless', 'underlined'];
  readonly options = signal<string[]>([]);

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options.set(value ? [value, value + value, value + value + value] : []);
  }
}
