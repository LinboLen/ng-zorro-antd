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
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  effect,
  forwardRef,
  inject,
  NgZone,
  ChangeDetectorRef,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

import { TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriSafeAny, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriCheckboxWrapperComponent } from './checkbox-wrapper.component';
import { TRI_CHECKBOX_GROUP } from './tokens';

@Component({
  selector: '[tri-checkbox]',
  exportAs: 'triCheckbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span
      class="tri-checkbox"
      [class.tri-checkbox-checked]="checked && !indeterminate"
      [class.tri-checkbox-disabled]="disabled || checkboxGroupComponent?.finalDisabled()"
      [class.tri-checkbox-indeterminate]="indeterminate"
    >
      <input
        #inputElement
        type="checkbox"
        class="tri-checkbox-input"
        [attr.autofocus]="autoFocus ? 'autofocus' : null"
        [attr.id]="id"
        [attr.name]="name || checkboxGroupComponent?.nzName()"
        [checked]="checked"
        [ngModel]="checked"
        [disabled]="disabled || (checkboxGroupComponent?.finalDisabled() ?? false)"
        (ngModelChange)="innerCheckedChange($event)"
      />
      <span class="tri-checkbox-inner"></span>
    </span>
    <span><ng-content></ng-content></span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriCheckboxComponent),
      multi: true
    }
  ],
  host: {
    class: 'tri-checkbox-wrapper',
    '[class.tri-checkbox-group-item]': '!!checkboxGroupComponent',
    '[class.tri-checkbox-wrapper-in-form-item]': '!!formStatusService',
    '[class.tri-checkbox-wrapper-checked]': 'checked',
    '[class.tri-checkbox-wrapper-disabled]': 'disabled || checkboxGroupComponent?.finalDisabled()',
    '[class.tri-checkbox-rtl]': `dir === 'rtl'`
  },
  imports: [FormsModule]
})
export class TriCheckboxComponent implements OnInit, ControlValueAccessor, AfterViewInit {
  private ngZone = inject(NgZone);
  private elementRef = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);
  private focusMonitor = inject(FocusMonitor);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  protected checkboxGroupComponent = inject(TRI_CHECKBOX_GROUP, { optional: true });
  protected formStatusService = inject(TriFormStatusService, { optional: true });
  /** @deprecated */
  private checkboxWrapperComponent = inject(TriCheckboxWrapperComponent, { optional: true });

  dir: Direction = 'ltr';
  private destroy$ = new Subject<void>();
  private isNzDisableFirstChange: boolean = true;

  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef<HTMLInputElement>;
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Input() value: TriSafeAny | null = null;
  @Input({ transform: booleanAttribute }) autoFocus = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) indeterminate = false;
  @Input({ transform: booleanAttribute }) checked = false;
  @Input() id: string | null = null;
  @Input() name: string | null = null;

  innerCheckedChange(checked: boolean): void {
    if (!this.disabled && !this.checkboxGroupComponent?.finalDisabled()) {
      this.setValue(checked);
      this.checkboxWrapperComponent?._onChange();
      this.checkboxGroupComponent?.onCheckedChange(this.value, checked);
    }
  }

  writeValue(value: boolean): void {
    this.checked = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || disabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }

  focus(): void {
    this.focusMonitor.focusVia(this.inputElement, 'keyboard');
  }

  blur(): void {
    this.inputElement.nativeElement.blur();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.elementRef);
      this.checkboxWrapperComponent?.removeCheckbox(this);
    });
    if (this.checkboxGroupComponent) {
      effect(() => {
        const values = this.checkboxGroupComponent!.value() || [];
        this.setValue(values.includes(this.value));
        this.cdr.markForCheck();
      });
    }
  }

  ngOnInit(): void {
    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          Promise.resolve().then(() => this.onTouched());
        }
      });

    this.checkboxWrapperComponent?.addCheckbox(this);

    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

    fromEventOutsideAngular(this.elementRef.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        event.preventDefault();
        this.focus();
        if (this.disabled) {
          return;
        }
        this.ngZone.run(() => {
          this.innerCheckedChange(!this.checked);
          this.cdr.markForCheck();
        });
      });

    fromEventOutsideAngular(this.inputElement.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => event.stopPropagation());
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.focus();
    }
  }

  private setValue(value: boolean): void {
    this.checked = value;
    this.onChange(value);
    this.checkedChange.emit(value);
  }
}
