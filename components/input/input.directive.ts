/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
  booleanAttribute,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { NgClassInterface, TriSizeLDSType, TriStatus, TriValidateStatus, TriVariant } from 'ng-zorro-antd/core/types';
import { getStatusClassNames } from 'ng-zorro-antd/core/util';
import { NZ_SPACE_COMPACT_ITEM_TYPE, NZ_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

@Directive({
  selector: '',
  exportAs: 'triInput',
  host: {
    class: 'tri-input',
    '[class.tri-input-disabled]': 'disabled',
    '[class.tri-input-borderless]': `variant === 'borderless' || (variant === 'outlined' && borderless)`,
    '[class.tri-input-filled]': `variant === 'filled'`,
    '[class.tri-input-underlined]': `variant === 'underlined'`,
    '[class.tri-input-lg]': `finalSize() === 'large'`,
    '[class.tri-input-sm]': `finalSize() === 'small'`,
    '[attr.disabled]': 'disabled || null',
    '[class.tri-input-rtl]': `dir=== 'rtl'`,
    '[class.tri-input-stepperless]': `stepperless`,
    '[class.tri-input-focused]': 'focused()'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  providers: [{ provide: NZ_SPACE_COMPACT_ITEM_TYPE, useValue: 'input' }]
})
export class TriInputDirective implements OnChanges, OnInit {
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  protected hostView = inject(ViewContainerRef);
  private directionality = inject(Directionality);
  private compactSize = inject(NZ_SPACE_COMPACT_SIZE, { optional: true });
  private destroyRef = inject(DestroyRef);
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });
  private focusMonitor = inject(FocusMonitor);

  /**
   * @deprecated Will be removed in v21. It is recommended to use `nzVariant` instead.
   */
  @Input({ transform: booleanAttribute }) borderless = false;
  @Input() variant: TriVariant = 'outlined';
  @Input() size: TriSizeLDSType = 'default';
  @Input({ transform: booleanAttribute }) stepperless: boolean = true;
  @Input() status: TriStatus = '';
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  _disabled = false;
  disabled$ = new Subject<boolean>();

  dir: Direction = 'ltr';
  // status
  prefixCls: string = 'ant-input';
  _status: TriValidateStatus = '';
  statusCls: NgClassInterface = {};
  hasFeedback: boolean = false;
  feedbackRef: ComponentRef<TriFormItemFeedbackIconComponent> | null = null;
  components: Array<ComponentRef<TriFormItemFeedbackIconComponent>> = [];
  ngControl = inject(NgControl, { self: true, optional: true });

  protected focused = signal<boolean>(false);
  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.focusMonitor.stopMonitoring(this.elementRef);
    });
  }

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    if (this.ngControl) {
      this.ngControl.statusChanges
        ?.pipe(
          filter(() => this.ngControl!.disabled !== null),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          this.disabled$.next(this.ngControl!.disabled!);
        });
    }

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
    });

    this.focusMonitor
      .monitor(this.elementRef, false)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(origin => this.focused.set(!!origin));
  }

  ngOnChanges({ disabled, nzStatus, nzSize }: SimpleChanges): void {
    if (disabled) {
      this.disabled$.next(this.disabled);
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  private setStatusStyles(status: TriValidateStatus, hasFeedback: boolean): void {
    // set inner status
    this._status = status;
    this.hasFeedback = hasFeedback;
    this.renderFeedbackIcon();
    // render status if nzStatus is set
    this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
    Object.keys(this.statusCls).forEach(status => {
      if (this.statusCls[status]) {
        this.renderer.addClass(this.elementRef.nativeElement, status);
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, status);
      }
    });
  }

  private renderFeedbackIcon(): void {
    if (!this._status || !this.hasFeedback || !!this.formNoStatusService) {
      // remove feedback
      this.hostView.clear();
      this.feedbackRef = null;
      return;
    }

    this.feedbackRef = this.feedbackRef || this.hostView.createComponent(TriFormItemFeedbackIconComponent);
    this.feedbackRef.location.nativeElement.classList.add('ant-input-suffix');
    this.feedbackRef.instance.status = this._status;
    this.feedbackRef.instance.updateIcon();
  }
}
