/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  DestroyRef,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriSafeAny, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriRadioService } from './radio.service';

@Component({
  selector: '',
  exportAs: 'triRadio',
  template: `
    <span
      [class.tri-radio]="!isRadioButton"
      [class.tri-radio-checked]="isChecked && !isRadioButton"
      [class.tri-radio-disabled]="disabled && !isRadioButton"
      [class.tri-radio-button]="isRadioButton"
      [class.tri-radio-button-checked]="isChecked && isRadioButton"
      [class.tri-radio-button-disabled]="disabled && isRadioButton"
    >
      <input
        #inputElement
        type="radio"
        [attr.autofocus]="autoFocus ? 'autofocus' : null"
        [class.tri-radio-input]="!isRadioButton"
        [class.tri-radio-button-input]="isRadioButton"
        [disabled]="disabled"
        [checked]="isChecked"
        [attr.name]="name"
      />
      <span [class.tri-radio-inner]="!isRadioButton" [class.tri-radio-button-inner]="isRadioButton"></span>
    </span>
    <span><ng-content></ng-content></span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriRadioComponent),
      multi: true
    }
  ],
  host: {
    '[class.tri-radio-wrapper-in-form-item]': '!!formStatusService',
    '[class.tri-radio-wrapper]': '!isRadioButton',
    '[class.tri-radio-button-wrapper]': 'isRadioButton',
    '[class.tri-radio-wrapper-checked]': 'isChecked && !isRadioButton',
    '[class.tri-radio-button-wrapper-checked]': 'isChecked && isRadioButton',
    '[class.tri-radio-wrapper-disabled]': 'disabled && !isRadioButton',
    '[class.tri-radio-button-wrapper-disabled]': 'disabled && isRadioButton',
    '[class.tri-radio-wrapper-rtl]': `!isRadioButton && dir === 'rtl'`,
    '[class.tri-radio-button-wrapper-rtl]': `isRadioButton && dir === 'rtl'`
  }
})
export class TriRadioComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  private readonly directionality = inject(Directionality);
  private readonly radioService = inject(TriRadioService, { optional: true });
  private readonly ngZone = inject(NgZone);
  private readonly elementRef = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly destroyRef = inject(DestroyRef);
  readonly formStatusService = inject(TriFormStatusService, { optional: true });

  private isNgModel = false;
  private isNzDisableFirstChange: boolean = true;
  isChecked = false;
  name: string | null = null;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef<HTMLInputElement>;
  @Input() value: TriSafeAny | null = null;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) autoFocus = false;
  @Input({ alias: 'nz-radio-button', transform: booleanAttribute }) isRadioButton = false;

  dir: Direction = 'ltr';

  focus(): void {
    this.focusMonitor.focusVia(this.inputElement!, 'keyboard');
  }

  blur(): void {
    this.inputElement!.nativeElement.blur();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.elementRef);
    });
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || disabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }

  writeValue(value: boolean): void {
    this.isChecked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.isNgModel = true;
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    if (this.radioService) {
      this.radioService.name$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(name => {
        this.name = name;
        this.cdr.markForCheck();
      });
      this.radioService.disabled$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(disabled => {
        this.disabled = (this.isNzDisableFirstChange && this.disabled) || disabled;
        this.isNzDisableFirstChange = false;
        this.cdr.markForCheck();
      });
      this.radioService.selected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
        const isChecked = this.isChecked;
        this.isChecked = this.value === value;
        // We don't have to run `onChange()` on each `nz-radio` button whenever the `selected$` emits.
        // If we have 8 `nz-radio` buttons within the `nz-radio-group` and they're all connected with
        // `ngModel` or `formControl` then `onChange()` will be called 8 times for each `nz-radio` button.
        // We prevent this by checking if `isChecked` has been changed or not.
        if (
          this.isNgModel &&
          isChecked !== this.isChecked &&
          // We're only intereted if `isChecked` has been changed to `false` value to emit `false` to the ascendant form,
          // since we already emit `true` within the `setupClickListener`.
          this.isChecked === false
        ) {
          this.onChange(false);
        }
        this.cdr.markForCheck();
      });
    }
    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          Promise.resolve().then(() => this.onTouched());
          if (this.radioService) {
            this.radioService.touch();
          }
        }
      });

    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

    this.setupClickListener();
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.focus();
    }
  }

  private setupClickListener(): void {
    fromEventOutsideAngular<MouseEvent>(this.elementRef.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        /** prevent label click triggered twice. **/
        event.stopPropagation();
        event.preventDefault();
        if (this.disabled || this.isChecked) {
          return;
        }
        this.ngZone.run(() => {
          this.focus();
          this.radioService?.select(this.value);
          if (this.isNgModel) {
            this.isChecked = true;
            this.onChange(true);
          }
          this.cdr.markForCheck();
        });
      });
  }
}
