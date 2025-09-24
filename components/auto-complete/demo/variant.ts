import { Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import type { TriVariant } from 'ng-zorro-antd/core/types';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-variant',
  imports: [FormsModule, TriAutocompleteModule, TriInputModule, TriFlexModule],
  template: `
    <section tri-flex vertical gap="1rem">
      @for (variant of variants(); track variant) {
        <div class="example-input">
          <input
            placeholder="input here"
            tri-input
            [(ngModel)]="inputValue"
            (input)="onInput($event)"
            [autocomplete]="auto"
            [variant]="variant"
          />
          <tri-autocomplete [dataSource]="options()" backfill #auto />
        </div>
      }
    </section>
  `
})
export class TriDemoAutoCompleteVariantComponent {
  options = signal<string[]>([]);
  inputValue = model<string>('');
  variants = signal<TriVariant[]>(['outlined', 'filled', 'borderless', 'underlined']);
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options.set(value ? [value, value + value, value + value + value] : []);
  }
}
