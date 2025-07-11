/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriSafeAny, TriSizeLDSType, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';

import { TriRadioService } from './radio.service';

export type TriRadioButtonStyle = 'outline' | 'solid';

@Component({
  selector: 'tri-radio-group',
  exportAs: 'triRadioGroup',
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TriRadioService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriRadioGroupComponent),
      multi: true
    }
  ],
  host: {
    class: 'tri-radio-group',
    '[class.tri-radio-group-large]': `size === 'large'`,
    '[class.tri-radio-group-small]': `size === 'small'`,
    '[class.tri-radio-group-solid]': `buttonStyle === 'solid'`,
    '[class.tri-radio-group-rtl]': `dir === 'rtl'`
  }
})
export class TriRadioGroupComponent implements OnInit, ControlValueAccessor, OnChanges {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly radioService = inject(TriRadioService);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  private value: TriSafeAny | null = null;
  private isNzDisableFirstChange: boolean = true;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() buttonStyle: TriRadioButtonStyle = 'outline';
  @Input() size: TriSizeLDSType = 'default';
  @Input() name: string | null = null;

  dir: Direction = 'ltr';

  ngOnInit(): void {
    this.radioService.selected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (this.value !== value) {
        this.value = value;
        this.onChange(this.value);
      }
    });
    this.radioService.touched$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      Promise.resolve().then(() => this.onTouched());
    });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDisabled, nzName } = changes;
    if (nzDisabled) {
      this.radioService.setDisabled(this.disabled);
    }
    if (nzName) {
      this.radioService.setName(this.name!);
    }
  }

  writeValue(value: TriSafeAny): void {
    this.value = value;
    this.radioService.select(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    this.radioService.setDisabled(this.disabled);
    this.cdr.markForCheck();
  }
}
