/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { booleanAttribute, computed, contentChild, Directive, ElementRef, input, output } from '@angular/core';

import { TriInputDirective } from './input.directive';

@Directive({
  selector: 'tri-input-search',
  exportAs: 'triInputSearch',
  host: {
    class: 'tri-input-search',
    '[class.tri-input-search-large]': `size() === 'large'`,
    '[class.tri-input-search-small]': `size() === 'small'`,
    '[class.tri-input-search-with-button]': 'enterButton() !== false',
    '(keydown.enter)': 'onEnter($any($event))'
  }
})
export class TriInputSearchDirective {
  private readonly inputDir = contentChild.required(TriInputDirective);
  private readonly inputRef = contentChild.required(TriInputDirective, { read: ElementRef });

  readonly enterButton = input<boolean | string>(false);
  readonly loading = input(false, { transform: booleanAttribute });

  readonly search = output<TriInputSearchEvent>();

  readonly size = computed(() => this.inputDir().size());

  _search(event: Event, source: 'input' | 'clear' = 'input'): void {
    if (!this.loading()) {
      this.search.emit({ value: this.inputRef().nativeElement.value, event, source });
    }
  }

  onEnter(event: KeyboardEvent): void {
    if (event.target === this.inputRef().nativeElement) {
      this._search(event);
    }
  }
}

@Directive({
  selector: '[triInputSearchEnterButton]'
})
export class TriInputSearchEnterButtonDirective {}

export interface TriInputSearchEvent {
  value: string;
  event: Event;
  source: 'clear' | 'input';
}
