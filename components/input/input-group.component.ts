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
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, startWith, switchMap } from 'rxjs/operators';

import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { NgClassInterface, TriSizeLDSType, TriStatus, TriValidateStatus } from 'ng-zorro-antd/core/types';
import { getStatusClassNames } from 'ng-zorro-antd/core/util';
import { NZ_SPACE_COMPACT_ITEM_TYPE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriInputGroupSlotComponent } from './input-group-slot.component';
import { TriInputDirective } from './input.directive';

@Directive({
  selector: `nz-input-group[nzSuffix], nz-input-group[nzPrefix]`
})
export class TriInputGroupWhitSuffixOrPrefixDirective {
  public readonly elementRef = inject(ElementRef);
}

@Component({
  selector: '',
  exportAs: 'triInputGroup',
  imports: [TriInputGroupSlotComponent, NgTemplateOutlet, TriFormItemFeedbackIconComponent],
  encapsulation: ViewEncapsulation.None,
  providers: [TriFormNoStatusService, { provide: NZ_SPACE_COMPACT_ITEM_TYPE, useValue: 'input' }],
  template: `
    @if (isAddOn) {
      <span class="tri-input-wrapper tri-input-group">
        @if (addOnBefore || addOnBeforeIcon) {
          <span tri-input-group-slot type="addon" [icon]="addOnBeforeIcon" [template]="addOnBefore"></span>
        }

        @if (isAffix || hasFeedback) {
          <span
            class="tri-input-affix-wrapper"
            [class.tri-input-affix-wrapper-disabled]="disabled"
            [class.tri-input-affix-wrapper-sm]="isSmall"
            [class.tri-input-affix-wrapper-lg]="isLarge"
            [class.tri-input-affix-wrapper-focused]="focused"
            [class]="affixInGroupStatusCls"
          >
            <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
          </span>
        } @else {
          <ng-template [ngTemplateOutlet]="contentTemplate" />
        }
        @if (addOnAfter || addOnAfterIcon) {
          <span tri-input-group-slot type="addon" [icon]="addOnAfterIcon" [template]="addOnAfter"></span>
        }
      </span>
    } @else {
      @if (isAffix) {
        <ng-template [ngTemplateOutlet]="affixTemplate" />
      } @else {
        <ng-template [ngTemplateOutlet]="contentTemplate" />
      }
    }

    <!-- affix template -->
    <ng-template #affixTemplate>
      @if (prefix || prefixIcon) {
        <span tri-input-group-slot type="prefix" [icon]="prefixIcon" [template]="prefix"></span>
      }
      <ng-template [ngTemplateOutlet]="contentTemplate" />
      @if (suffix || suffixIcon || isFeedback) {
        <span tri-input-group-slot type="suffix" [icon]="suffixIcon" [template]="suffix">
          @if (isFeedback) {
            <tri-form-item-feedback-icon [status]="status" />
          }
        </span>
      }
    </ng-template>

    <!-- content template -->
    <ng-template #contentTemplate>
      <ng-content></ng-content>
      @if (!isAddOn && !isAffix && isFeedback) {
        <span tri-input-group-slot type="suffix">
          <tri-form-item-feedback-icon [status]="status" />
        </span>
      }
    </ng-template>
  `,
  host: {
    '[class.tri-input-search-enter-button]': `search`,
    '[class.tri-input-search]': `search`,
    '[class.tri-input-search-rtl]': `dir === 'rtl'`,
    '[class.tri-input-search-sm]': `search && isSmall`,
    '[class.tri-input-search-large]': `search && isLarge`,
    '[class.tri-input-group-wrapper]': `isAddOn`,
    '[class.tri-input-group-wrapper-rtl]': `dir === 'rtl'`,
    '[class.tri-input-group-wrapper-lg]': `isAddOn && isLarge`,
    '[class.tri-input-group-wrapper-sm]': `isAddOn && isSmall`,
    '[class.tri-input-affix-wrapper]': `isAffix && !isAddOn`,
    '[class.tri-input-affix-wrapper-rtl]': `dir === 'rtl'`,
    '[class.tri-input-affix-wrapper-focused]': `isAffix && focused`,
    '[class.tri-input-affix-wrapper-disabled]': `isAffix && disabled`,
    '[class.tri-input-affix-wrapper-lg]': `isAffix && !isAddOn && isLarge`,
    '[class.tri-input-affix-wrapper-sm]': `isAffix && !isAddOn && isSmall`,
    '[class.tri-input-group]': `!isAffix && !isAddOn`,
    '[class.tri-input-group-rtl]': `dir === 'rtl'`,
    '[class.tri-input-group-lg]': `!isAffix && !isAddOn && isLarge`,
    '[class.tri-input-group-sm]': `!isAffix && !isAddOn && isSmall`
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriInputGroupComponent implements AfterContentInit, OnChanges, OnInit {
  private focusMonitor = inject(FocusMonitor);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  @ContentChildren(TriInputDirective) listOfNzInputDirective!: QueryList<TriInputDirective>;
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
  @Input({ transform: booleanAttribute }) search = false;
  isLarge = false;
  isSmall = false;
  isAffix = false;
  isAddOn = false;
  isFeedback = false;
  focused = false;
  disabled = false;
  dir: Direction = 'ltr';
  // status
  prefixCls: string = 'ant-input';
  affixStatusCls: NgClassInterface = {};
  groupStatusCls: NgClassInterface = {};
  affixInGroupStatusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;

  constructor() {
    this.destroyRef.onDestroy(() => this.focusMonitor.stopMonitoring(this.elementRef));
  }

  updateChildrenInputSize(): void {
    if (this.listOfNzInputDirective) {
      this.listOfNzInputDirective.forEach(item => item['size'].set(this.size));
    }
  }

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => pre.status === cur.status && pre.hasFeedback === cur.hasFeedback),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focusOrigin => {
        this.focused = !!focusOrigin;
        this.cdr.markForCheck();
      });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });
  }

  ngAfterContentInit(): void {
    this.updateChildrenInputSize();
    const listOfInputChange$ = this.listOfNzInputDirective.changes.pipe(startWith(this.listOfNzInputDirective));
    listOfInputChange$
      .pipe(
        switchMap(list => merge(...[listOfInputChange$, ...list.map((input: TriInputDirective) => input.disabled$)])),
        mergeMap(() => listOfInputChange$),
        map(list => list.some((input: TriInputDirective) => input.disabled)),
        takeUntilDestroyed(this.destroyRef)
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
