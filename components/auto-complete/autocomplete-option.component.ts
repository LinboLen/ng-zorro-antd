/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, scrollIntoView } from 'ng-zorro-antd/core/util';

import { TriAutocompleteOptgroupComponent } from './autocomplete-optgroup.component';

export class TriOptionSelectionChange {
  constructor(
    public source: TriAutocompleteOptionComponent,
    public isUserInput: boolean = false
  ) {}
}

@Component({
  selector: 'tri-auto-option',
  exportAs: 'triAutoOption',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="tri-select-item-option-content">
      <ng-content />
    </div>
  `,
  host: {
    role: 'menuitem',
    class: 'tri-select-item ant-select-item-option',
    '[class.tri-select-item-option-grouped]': 'autocompleteOptgroupComponent',
    '[class.tri-select-item-option-selected]': 'selected',
    '[class.tri-select-item-option-active]': 'active',
    '[class.tri-select-item-option-disabled]': 'disabled',
    '[attr.aria-selected]': 'selected.toString()',
    '[attr.aria-disabled]': 'nzDisabled.toString()',
    '(click)': 'selectViaInteraction()'
  }
})
export class TriAutocompleteOptionComponent implements OnInit {
  private ngZone = inject(NgZone);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private element = inject(ElementRef<HTMLElement>);
  private destroyRef = inject(DestroyRef);

  @Input() value: TriSafeAny;
  @Input() label?: string;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() readonly selectionChange = new EventEmitter<TriOptionSelectionChange>();
  @Output() readonly mouseEntered = new EventEmitter<TriAutocompleteOptionComponent>();

  active = false;
  selected = false;
  autocompleteOptgroupComponent = inject(TriAutocompleteOptgroupComponent, { optional: true });

  ngOnInit(): void {
    fromEventOutsideAngular(this.element.nativeElement, 'mouseenter')
      .pipe(
        filter(() => this.mouseEntered.observers.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.ngZone.run(() => this.mouseEntered.emit(this));
      });

    fromEventOutsideAngular(this.element.nativeElement, 'mousedown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => event.preventDefault());
  }

  select(emit: boolean = true): void {
    this.selected = true;
    this.changeDetectorRef.markForCheck();
    if (emit) {
      this.emitSelectionChangeEvent();
    }
  }

  deselect(): void {
    this.selected = false;
    this.changeDetectorRef.markForCheck();
    this.emitSelectionChangeEvent();
  }

  /** Git display label */
  getLabel(): string {
    return this.label || this.value.toString();
  }

  /** Set active (only styles) */
  setActiveStyles(): void {
    if (!this.active) {
      this.active = true;
      this.changeDetectorRef.markForCheck();
    }
  }

  /** Unset active (only styles) */
  setInactiveStyles(): void {
    if (this.active) {
      this.active = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  scrollIntoViewIfNeeded(): void {
    scrollIntoView(this.element.nativeElement);
  }

  selectViaInteraction(): void {
    if (!this.disabled) {
      this.selected = !this.selected;
      if (this.selected) {
        this.setActiveStyles();
      } else {
        this.setInactiveStyles();
      }
      this.emitSelectionChangeEvent(true);
      this.changeDetectorRef.markForCheck();
    }
  }

  private emitSelectionChangeEvent(isUserInput: boolean = false): void {
    this.selectionChange.emit(new TriOptionSelectionChange(this, isUserInput));
  }
}
