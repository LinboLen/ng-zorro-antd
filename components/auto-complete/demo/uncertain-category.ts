import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-uncertain-category',
  imports: [FormsModule, TriAutocompleteModule, TriFlexModule, TriInputModule],
  template: `
    <tri-input-search enterButton>
      <input
        tri-input
        placeholder="input here"
        size="large"
        [(ngModel)]="value"
        (input)="onChange($event)"
        [autocomplete]="auto"
      />
    </tri-input-search>
    <tri-autocomplete #auto>
      @for (option of options(); track option.category) {
        <tri-auto-option [value]="option.category">
          <tri-flex justify="space-between">
            <span>
              Found {{ option.value }} on
              <a href="https://s.taobao.com/search?q={{ option.value }}" target="_blank" rel="noopener noreferrer">
                {{ option.category }}
              </a>
            </span>
            <span>{{ option.count }} results</span>
          </tri-flex>
        </tri-auto-option>
      }
    </tri-autocomplete>
  `
})
export class TriDemoAutoCompleteUncertainCategoryComponent {
  value?: string;
  readonly options = signal<Array<{ value: string; category: string; count: number }>>([]);

  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.options.set(
      new Array(this.getRandomInt(5, 15))
        .join('.')
        .split('.')
        .map((_item, idx) => ({
          value,
          category: `${value}${idx}`,
          count: this.getRandomInt(200, 100)
        }))
    );
  }

  private getRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
