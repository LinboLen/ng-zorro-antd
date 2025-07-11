/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { Subject, merge } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { NgClassInterface, TriSizeLDSType, TriStatus, TriValidateStatus } from 'ng-zorro-antd/core/types';
import { getStatusClassNames } from 'ng-zorro-antd/core/util';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriInputNumberGroupSlotComponent } from './input-number-group-slot.component';
import { TriInputNumberLegacyComponent } from './input-number.component';

/**
 * @deprecated Will be removed in v21. It is recommended to use the new version `<nz-input-number>`.
 */
@Directive({
  selector: `nz-input-number-group[nzSuffix], nz-input-number-group[nzPrefix]`
})
export class TriInputNumberGroupWhitSuffixOrPrefixDirective {
  constructor(public elementRef: ElementRef) {}
}

/**
 * @deprecated Will be removed in v21. It is recommended to use the new version `<nz-input-number>`.
 */
@Component({
  selector: 'tri-input-number-group',
  exportAs: 'triInputNumberGroup',
  imports: [TriInputNumberGroupSlotComponent, NgTemplateOutlet, TriFormItemFeedbackIconComponent],
  template: `
    @if (isAddOn) {
      <span class="tri-input-number-wrapper tri-input-number-group">
        @if (addOnBefore || addOnBeforeIcon) {
          <div tri-input-number-group-slot type="addon" [icon]="addOnBeforeIcon" [template]="addOnBefore"></div>
        }

        @if (isAffix || hasFeedback) {
          <div
            class="tri-input-number-affix-wrapper"
            [class.tri-input-number-affix-wrapper-disabled]="disabled"
            [class.tri-input-number-affix-wrapper-sm]="isSmall"
            [class.tri-input-number-affix-wrapper-lg]="isLarge"
            [class.tri-input-number-affix-wrapper-focused]="focused"
            [class]="affixInGroupStatusCls"
          >
            <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
          </div>
        } @else {
          <ng-template [ngTemplateOutlet]="contentTemplate" />
        }

        @if (addOnAfter || addOnAfterIcon) {
          <span tri-input-number-group-slot type="addon" [icon]="addOnAfterIcon" [template]="addOnAfter"></span>
        }
      </span>
    } @else {
      @if (isAffix) {
        <ng-template [ngTemplateOutlet]="affixTemplate" />
      } @else {
        <ng-template [ngTemplateOutlet]="contentTemplate" />
      }
    }

    <!-- Affix Template -->
    <ng-template #affixTemplate>
      @if (prefix || prefixIcon) {
        <span tri-input-number-group-slot type="prefix" [icon]="prefixIcon" [template]="prefix"></span>
      }
      <ng-template [ngTemplateOutlet]="contentTemplate" />
      @if (suffix || suffixIcon || isFeedback) {
        <span tri-input-number-group-slot type="suffix" [icon]="suffixIcon" [template]="suffix">
          @if (isFeedback) {
            <tri-form-item-feedback-icon [status]="status" />
          }
        </span>
      }
    </ng-template>

    <!-- Content Template -->
    <ng-template #contentTemplate>
      <ng-content />
      @if (!isAddOn && !isAffix && isFeedback) {
        <span tri-input-number-group-slot type="suffix">
          @if (isFeedback) {
            <tri-form-item-feedback-icon [status]="status" />
          }
        </span>
      }
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TriFormNoStatusService, { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'input-number' }],
  host: {
    '[class.tri-input-number-group-wrapper]': `isAddOn`,
    '[class.tri-input-number-group-wrapper-rtl]': `isAddOn && dir === 'rtl'`,
    '[class.tri-input-number-group-wrapper-lg]': `isAddOn && isLarge`,
    '[class.tri-input-number-group-wrapper-sm]': `isAddOn && isSmall`,
    '[class.tri-input-number-affix-wrapper]': `!isAddOn && isAffix`,
    '[class.tri-input-number-affix-wrapper-rtl]': `!isAddOn && dir === 'rtl'`,
    '[class.tri-input-number-affix-wrapper-focused]': `!isAddOn && isAffix && focused`,
    '[class.tri-input-number-affix-wrapper-disabled]': `!isAddOn && isAffix && disabled`,
    '[class.tri-input-number-affix-wrapper-lg]': `!isAddOn && isAffix && isLarge`,
    '[class.tri-input-number-affix-wrapper-sm]': `!isAddOn && isAffix && isSmall`
  },
  hostDirectives: [TriSpaceCompactItemDirective]
})
export class TriInputNumberGroupComponent implements AfterContentInit, OnChanges, OnInit, OnDestroy {
  @ContentChildren(TriInputNumberLegacyComponent, { descendants: true })
  listOfNzInputNumberComponent!: QueryList<TriInputNumberLegacyComponent>;
  @Input() addOnBeforeIcon?: string | null = null;
  @Input() addOnAfterIcon?: string | null = null;
  @Input() prefixIcon?: string | null = null;
  @Input() suffixIcon?: string | null = null;
  @Input() addOnBefore?: string | TemplateRef<void>;
  @Input() addOnAfter?: string | TemplateRef<void>;
  @Input() prefix?: string | TemplateRef<void>;
  @Input() status: TriStatus = '';
  @Input() suffix?: string | TemplateRef<void>;
  @Input() size: TriSizeLDSType = 'default';

  isLarge = false;
  isSmall = false;
  isAffix = false;
  isAddOn = false;
  isFeedback = false;
  focused = false;
  disabled = false;
  dir: Direction = 'ltr';
  // status
  prefixCls: string = 'ant-input-number';
  affixStatusCls: NgClassInterface = {};
  groupStatusCls: NgClassInterface = {};
  affixInGroupStatusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;
  private destroy$ = new Subject<void>();
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  constructor(
    private focusMonitor: FocusMonitor,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private directionality: Directionality
  ) {}

  updateChildrenInputSize(): void {
    if (this.listOfNzInputNumberComponent) {
      this.listOfNzInputNumberComponent.forEach(item => item['size'].set(this.size));
    }
  }

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
        this.cdr.markForCheck();
      });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngAfterContentInit(): void {
    this.updateChildrenInputSize();
    const listOfInputChange$ = this.listOfNzInputNumberComponent.changes.pipe(
      startWith(this.listOfNzInputNumberComponent)
    );
    listOfInputChange$
      .pipe(
        switchMap(list =>
          merge(...[listOfInputChange$, ...list.map((input: TriInputNumberLegacyComponent) => input.disabled$)])
        ),
        mergeMap(() => listOfInputChange$),
        map(list => list.some((input: TriInputNumberLegacyComponent) => input.disabled)),
        takeUntil(this.destroy$)
      )
      .subscribe(disabled => {
        this.disabled = disabled;
        this.cdr.markForCheck();
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    const {
      nzSize,
      nzSuffix,
      nzPrefix,
      nzPrefixIcon,
      nzSuffixIcon,
      nzAddOnAfter,
      nzAddOnBefore,
      nzAddOnAfterIcon,
      nzAddOnBeforeIcon,
      nzStatus
    } = changes;
    if (nzSize) {
      this.updateChildrenInputSize();
      this.isLarge = this.size === 'large';
      this.isSmall = this.size === 'small';
    }
    if (nzSuffix || nzPrefix || nzPrefixIcon || nzSuffixIcon) {
      this.isAffix = !!(this.suffix || this.prefix || this.prefixIcon || this.suffixIcon);
    }
    if (nzAddOnAfter || nzAddOnBefore || nzAddOnAfterIcon || nzAddOnBeforeIcon) {
      this.isAddOn = !!(this.addOnAfter || this.addOnBefore || this.addOnAfterIcon || this.addOnBeforeIcon);
      this.formNoStatusService?.noFormStatus?.next(this.isAddOn);
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
  }
  ngOnDestroy(): void {
    this.focusMonitor.stopMonitoring(this.elementRef);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setStatusStyles(status: TriValidateStatus, hasFeedback: boolean): void {
    // set inner status
    this._status = status;
    this.hasFeedback = hasFeedback;
    this.isFeedback = !!status && hasFeedback;
    const baseAffix = !!(this.suffix || this.prefix || this.prefixIcon || this.suffixIcon);
    this.isAffix = baseAffix || (!this.isAddOn && hasFeedback);
    this.affixInGroupStatusCls =
      this.isAffix || this.isFeedback
        ? (this.affixStatusCls = getStatusClassNames(`${this.prefixCls}-affix-wrapper`, status, hasFeedback))
        : {};
    this.cdr.markForCheck();
    // render status if nzStatus is set
    this.affixStatusCls = getStatusClassNames(
      `${this.prefixCls}-affix-wrapper`,
      this.isAddOn ? '' : status,
      this.isAddOn ? false : hasFeedback
    );
    this.groupStatusCls = getStatusClassNames(
      `${this.prefixCls}-group-wrapper`,
      this.isAddOn ? status : '',
      this.isAddOn ? hasFeedback : false
    );
    const statusCls = {
      ...this.affixStatusCls,
      ...this.groupStatusCls
    };
    Object.keys(statusCls).forEach(status => {
      if (statusCls[status]) {
        this.renderer.addClass(this.elementRef.nativeElement, status);
      } else {
        this.renderer.removeClass(this.elementRef.nativeElement, status);
      }
    });
  }
}
