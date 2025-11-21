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
import { EMPTY } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriSizeLDSType, TriStatus, TriVariant } from 'ng-zorro-antd/core/types';
import { getStatusClassNames } from 'ng-zorro-antd/core/util';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriInputPasswordDirective } from './input-password.directive';
import { TriInputSearchDirective } from './input-search.directive';
import { TRI_INPUT_WRAPPER } from './tokens';

const PREFIX_CLS = 'ant-input';

@Directive({
  selector: 'input[nz-input],textarea[nz-input]',
  exportAs: 'triInput',
  host: {
    class: 'tri-input',
    '[attr.type]': 'type()',
    '[class]': 'classes()',
    '[class.tri-input-disabled]': 'finalDisabled()',
    '[class.tri-input-borderless]': `variant() === 'borderless'`,
    '[class.tri-input-filled]': `variant() === 'filled'`,
    '[class.tri-input-underlined]': `variant() === 'underlined'`,
    '[class.tri-input-lg]': `finalSize() === 'large'`,
    '[class.tri-input-sm]': `finalSize() === 'small'`,
    '[attr.disabled]': 'finalDisabled() || null',
    '[attr.readonly]': 'readonly() || null',
    '[class.tri-input-rtl]': `dir() === 'rtl'`,
    '[class.tri-input-stepperless]': `stepperless()`,
    '[class.tri-input-focused]': 'focused()'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  providers: [{ provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'input' }]
})
export class TriInputDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private destroyRef = inject(DestroyRef);
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });
  private inputWrapper = inject(TRI_INPUT_WRAPPER, { host: true, optional: true });
  private focusMonitor = inject(FocusMonitor);
  protected hostView = inject(ViewContainerRef);
  protected readonly inputPasswordDir = inject(TriInputPasswordDirective, { host: true, optional: true });
  protected readonly inputSearchDir = inject(TriInputSearchDirective, { host: true, optional: true });

  readonly ngControl = inject(NgControl, { self: true, optional: true });
  readonly value = signal<string>(this.elementRef.nativeElement.value);

  readonly variant = input<TriVariant>('outlined');
  readonly size = input<TriSizeLDSType>('default');
  /**
   * @deprecated Will be removed in v22.
   */
  readonly stepperless = input(true, { transform: booleanAttribute });
  readonly status = input<TriStatus>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });

  readonly controlDisabled = signal(false);
  readonly finalDisabled = this.ngControl ? this.controlDisabled : this.disabled;
  readonly dir = inject(Directionality).valueSignal;
  // TODO: When the input group is removed, we can remove this.
  readonly _size = linkedSignal(this.size);

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
    if (this.compactSize) {
      return this.compactSize();
    }
    return this._size();
  });

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

    this.ngControl?.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.value.set(value);
    });
  }

  private renderFeedbackIcon(): void {
    if (!this._status() || !this.hasFeedback() || this.inputWrapper || !!this.formNoStatusService) {
      // remove feedback
      this.hostView.clear();
      this.feedbackRef = null;
      return;
    }

    this.feedbackRef = this.feedbackRef || this.hostView.createComponent(TriFormItemFeedbackIconComponent);
    this.feedbackRef.location.nativeElement.classList.add('ant-input-suffix');
    this.feedbackRef.instance.status = this._status();
    this.feedbackRef.instance.updateIcon();
  }
}
