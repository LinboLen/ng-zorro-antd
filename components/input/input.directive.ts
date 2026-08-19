/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  signal,
  ViewContainerRef
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { FORM_FIELD } from '@angular/forms/signals';
import { EMPTY } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import {
  TRI_FORM_SIZE,
  TRI_FORM_VARIANT,
  TriFormItemFeedbackIconComponent,
  TriFormStatusService
} from 'ng-zorro-antd/core/form';
import { TriSizeLDSType, TriStatus, TriVariant } from 'ng-zorro-antd/core/types';
import { getStatusClassNames, InputFocusOptions, triggerFocus } from 'ng-zorro-antd/core/util';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriInputPasswordDirective } from './input-password.directive';
import { TRI_INPUT_SEARCH, TRI_INPUT_WRAPPER } from './tokens';

const PREFIX_CLS = 'ant-input';

@Directive({
  selector: 'input[nz-input],textarea[nz-input]',
  exportAs: 'triInput',
  host: {
    class: 'tri-input',
    '[attr.type]': 'type()',
    '[class]': 'classes()',
    '[class.tri-input-disabled]': 'finalDisabled()',
    '[class.tri-input-outlined]': `finalVariant() === 'outlined'`,
    '[class.tri-input-borderless]': `finalVariant() === 'borderless'`,
    '[class.tri-input-filled]': `finalVariant() === 'filled'`,
    '[class.tri-input-underlined]': `finalVariant() === 'underlined'`,
    '[class.tri-input-lg]': `finalSize() === 'large'`,
    '[class.tri-input-sm]': `finalSize() === 'small'`,
    '[attr.disabled]': 'finalDisabled() || null',
    '[attr.readonly]': 'readonly() || null',
    '(input)': 'onInput($event)',
    '[class.tri-input-rtl]': `dir() === 'rtl'`,
    '[class.tri-input-focused]': 'focused()'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  providers: [{ provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'input' }]
})
export class TriInputDirective implements OnInit {
  private elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private destroyRef = inject(DestroyRef);
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private inputWrapper = inject(TRI_INPUT_WRAPPER, { host: true, optional: true });
  private focusMonitor = inject(FocusMonitor);
  private hostView = inject(ViewContainerRef);
  private readonly inputPasswordDir = inject(TriInputPasswordDirective, { host: true, optional: true });
  private readonly inputSearchDir = inject(TRI_INPUT_SEARCH, { host: true, optional: true });
  private readonly formField = inject(FORM_FIELD, { self: true, optional: true });

  readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly nativeValue = signal(this.elementRef.nativeElement.value);
  readonly value = computed(() => {
    if (this.formField) {
      return String(this.formField.state().value() ?? '');
    }
    return this.nativeValue();
  });

  readonly variant = input<TriVariant>();
  readonly size = input<TriSizeLDSType>('default');
  readonly status = input<TriStatus>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });

  readonly controlDisabled = signal(false);
  readonly finalDisabled = computed(() => {
    if (this.formField) {
      return this.formField.state().disabled();
    }
    return this.ngControl ? this.controlDisabled() : this.disabled();
  });
  readonly dir = inject(Directionality).valueSignal;
  // TODO: When the input group is removed, we can remove this.
  readonly _size = linkedSignal(this.size);

  private readonly formSize = inject(TRI_FORM_SIZE, { optional: true });
  private readonly formVariant = inject(TRI_FORM_VARIANT, { optional: true });

  readonly _status = this.formStatusService
    ? toSignal(this.formStatusService.formStatusChanges.pipe(map(value => value.status)), { initialValue: '' })
    : this.status;
  readonly hasFeedback = toSignal(
    this.formStatusService?.formStatusChanges.pipe(map(value => value.hasFeedback)) ?? EMPTY,
    { initialValue: false }
  );
  readonly classes = computed(() => getStatusClassNames(PREFIX_CLS, this._status(), this.hasFeedback()));
  readonly type = computed(() => {
    if (this.inputPasswordDir) {
      return this.inputPasswordDir.visible() ? 'text' : 'password';
    }
    if (this.inputSearchDir) {
      return 'search';
    }
    return this.elementRef.nativeElement.getAttribute('type') || 'text';
  });

  protected readonly focused = signal<boolean>(false);
  protected readonly finalSize = computed(() => {
    if (this.formSize?.()) {
      return this.formSize();
    }
    if (this.compactSize) {
      return this.compactSize();
    }
    return this._size();
  });

  protected readonly finalVariant = computed(() => this.variant() || this.formVariant?.() || 'outlined');

  feedbackRef: ComponentRef<TriFormItemFeedbackIconComponent> | null = null;
  // TODO: When the input group is removed, we can remove this.
  disabled$ = toObservable(this.finalDisabled);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.elementRef);
    });

    this.focusMonitor
      .monitor(this.elementRef, false)
      .pipe(takeUntilDestroyed())
      .subscribe(origin => this.focused.set(!!origin));

    effect(() => {
      this.renderFeedbackIcon();
    });
  }

  ngOnInit(): void {
    // statusChanges is only accessible in onInit
    this.ngControl?.statusChanges?.pipe(startWith(null), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.controlDisabled.set(!!this.ngControl!.disabled);
    });

    this.ngControl?.valueChanges
      ?.pipe(startWith(this.ngControl?.control?.value), takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        // The control may hold a non-string value (e.g. a `FormControl<number>`
        // behind `type="number"`); `nativeValue` must stay a string so that
        // consumers such as the count suffix can rely on string semantics.
        this.nativeValue.set(String(value ?? ''));
      });
  }

  onInput(event: Event): void {
    this.nativeValue.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
  }

  /**
   * Writes a value into whichever binding owns the input's value.
   *
   * Features that change the value from outside the control — `nzAllowClear`
   * and `nzCount` — must go through here rather than through `ngControl`.
   * A Signal Forms binding does provide an `NgControl`, but it is a read-only
   * interop object: it has no `setValue`, so writing through it throws
   * `setValue is not a function` and the value is left untouched.
   *
   * Mirrors the branching of {@link value}, which reads from the same bindings.
   */
  writeValue(value: string): void {
    if (this.formField) {
      this.formField.state().value.set(value);
      return;
    }

    this.ngControl?.control?.setValue(value);
  }

  private renderFeedbackIcon(): void {
    if (!this._status() || !this.hasFeedback() || this.inputWrapper) {
      // remove feedback
      this.hostView.clear();
      this.feedbackRef = null;
      return;
    }

    this.feedbackRef = this.feedbackRef || this.hostView.createComponent(TriFormItemFeedbackIconComponent);
    this.feedbackRef.location.nativeElement.classList.add('ant-input-suffix');
    this.feedbackRef.setInput('status', this._status());
  }

  focus(options?: InputFocusOptions): void {
    triggerFocus(this.elementRef.nativeElement, options);
  }

  blur(): void {
    this.elementRef.nativeElement.blur();
  }
}
