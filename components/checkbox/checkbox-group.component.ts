/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  linkedSignal,
  signal,
  untracked
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';

import { TriCheckboxComponent } from './checkbox.component';
import { NZ_CHECKBOX_GROUP } from './tokens';

export interface TriCheckboxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Component({
  selector: '',
  exportAs: 'triCheckboxGroup',
  imports: [TriCheckboxComponent],
  template: `
    <ng-content>
      @for (option of normalizedOptions(); track option.value) {
        <label
          tri-checkbox
          [value]="option.value"
          [name]="name()"
          [disabled]="option.disabled || finalDisabled()"
        >
          {{ option.label }}
        </label>
      }
    </ng-content>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriCheckboxGroupComponent),
      multi: true
    },
    {
      provide: NZ_CHECKBOX_GROUP,
      useExisting: forwardRef(() => TriCheckboxGroupComponent)
    }
  ],
  host: {
    class: 'tri-checkbox-group',
    '[class.tri-checkbox-group-rtl]': `dir() === 'rtl'`
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriCheckboxGroupComponent implements ControlValueAccessor {
  private onChange: OnChangeType = () => {};
  private onTouched: OnTouchedType = () => {};
  private isDisabledFirstChange = true;
  private readonly directionality = inject(Directionality);

  readonly name = input<string | null>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly options = input<TriCheckboxOption[] | string[] | number[]>([]);
  readonly value = signal<Array<TriCheckboxOption['value']> | null>(null);
  readonly finalDisabled = linkedSignal(() => this.disabled());

  protected readonly dir = toSignal(this.directionality.change, { initialValue: this.directionality.value });
  protected readonly normalizedOptions = computed(() => normalizeOptions(this.options()));

  constructor() {
    const elementRef = inject(ElementRef);
    const focusMonitor = inject(FocusMonitor);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      focusMonitor
        .monitor(elementRef, true)
        .pipe(takeUntilDestroyed(destroyRef))
        .subscribe(focusOrigin => {
          if (!focusOrigin) {
            this.onTouched();
          }
        });

      destroyRef.onDestroy(() => {
        focusMonitor.stopMonitoring(elementRef);
      });
    });
  }

  writeValue(value: Array<string | number> | null): void {
    untracked(() => {
      this.value.set(value);
    });
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    untracked(() => {
      this.finalDisabled.set((this.isDisabledFirstChange && this.disabled()) || disabled);
    });
    this.isDisabledFirstChange = false;
  }

  onCheckedChange(optionValue: TriCheckboxOption['value'], checked: boolean): void {
    if (this.finalDisabled()) return;

    this.value.update(value => {
      if (checked) {
        return value?.concat(optionValue) || [optionValue];
      } else {
        return value?.filter(val => val !== optionValue) || [];
      }
    });

    this.onChange(this.value());
  }
}

function normalizeOptions(value: string[] | number[] | TriCheckboxOption[]): TriCheckboxOption[] {
  return value.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return {
        label: `${item}`,
        value: item
      };
    }

    return item;
  });
}
