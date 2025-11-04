import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-auto-complete-uncertain-category',
  imports: [FormsModule, TriAutocompleteModule, TriButtonModule, TriIconModule, TriInputModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <tri-input-search enterButton>
      <input
        tri-input
        placeholder="input here"
        size="large"
        [(ngModel)]="inputValue"
        (input)="onChange($event)"
        [autocomplete]="auto"
      />
    </tri-input-search>
    <tri-autocomplete #auto>
      @for (option of options; track option.category) {
        <tri-auto-option class="search-item" [value]="option.category">
          Found {{ option.value }} on
          <a
            class="search-item-desc"
            [href]="'https://s.taobao.com/search?q=' + option.value"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ option.category }}
          </a>
          <span class="search-item-count">{{ option.count }} results</span>
        </tri-auto-option>
      }
    </tri-autocomplete>
  `,
  styles: [
    `
      .search-item {
        display: flex;
      }

      .search-item-desc {
        flex: auto;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .search-item-count {
        flex: none;
      }
    `
  ]
})
export class TriDemoAutoCompleteUncertainCategoryComponent {
  inputValue?: string;
  options: Array<{ value: string; category: string; count: number }> = [];

  onChange(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.options = new Array(this.getRandomInt(5, 15))
      .join('.')
      .split('.')
      .map((_item, idx) => ({
        value,
        category: `${value}${idx}`,
        count: this.getRandomInt(200, 100)
      }));
  }

  private getRandomInt(max: number, min: number = 0): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
