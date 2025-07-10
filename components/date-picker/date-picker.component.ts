/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { of } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { DATE_PICKER_POSITION_MAP, DEFAULT_DATE_PICKER_POSITIONS, TriOverlayModule } from 'ng-zorro-antd/core/overlay';
import { CandyDate, cloneDate, CompatibleValue, wrongSortOrder } from 'ng-zorro-antd/core/time';
import {
  BooleanInput,
  FunctionProp,
  NgClassInterface,
  TriSafeAny,
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  TriVariant,
  OnChangeType,
  OnTouchedType
} from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, getStatusClassNames, toBoolean, valueFunctionProp } from 'ng-zorro-antd/core/util';
import {
  DateHelperService,
  TriDatePickerI18nInterface,
  TriDatePickerLangI18nInterface,
  TriI18nService
} from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { DatePickerService } from './date-picker.service';
import { DateRangePopupComponent } from './date-range-popup.component';
import {
  CompatibleDate,
  DisabledTimeFn,
  TriDateMode,
  TriPanelChangeType,
  PresetRanges,
  RangePartType,
  SupportTimeOptions
} from './standard-types';
import { PREFIX_CLASS } from './util';

const POPUP_STYLE_PATCH = { position: 'relative' }; // Aim to override antd's style to support overlay's position strategy (position:absolute will cause it not working because the overlay can't get the height/width of it's content)
const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'datePicker';

export type TriDatePickerSizeType = 'large' | 'default' | 'small';
export type TriPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'; // todo: export it in public API

/**
 * The base picker for all common APIs
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: '',
  exportAs: 'triDatePicker',
  template: `
    @if (!inline) {
      @if (!isRange) {
        <div class="{{ prefixCls }}-input">
          <input
            #pickerInput
            [attr.id]="id"
            [class.tri-input-disabled]="disabled"
            [disabled]="disabled"
            [readOnly]="inputReadOnly"
            [(ngModel)]="inputValue"
            placeholder="{{ getPlaceholder() }}"
            [size]="inputSize"
            autocomplete="off"
            (focus)="onFocus($event)"
            (focusout)="onFocusout($event)"
            (ngModelChange)="onInputChange($event)"
            (keyup.enter)="onKeyupEnter($event)"
          />
          <ng-container *ngTemplateOutlet="tplRightRest" />
        </div>
      } @else {
        <div class="{{ prefixCls }}-input">
          <ng-container *ngTemplateOutlet="tplRangeInput; context: { partType: 'left' }" />
        </div>
        <div #separatorElement class="{{ prefixCls }}-range-separator">
          <span class="{{ prefixCls }}-separator">
            <ng-container *stringTemplateOutlet="separator; let separator">
              @if (separator) {
                {{ separator }}
              } @else {
                <tri-icon type="swap-right" theme="outline" />
              }
            </ng-container>
          </span>
        </div>
        <div class="{{ prefixCls }}-input">
          <ng-container *ngTemplateOutlet="tplRangeInput; context: { partType: 'right' }" />
        </div>
        <ng-container *ngTemplateOutlet="tplRightRest" />
      }
    } @else {
      <ng-template [ngTemplateOutlet]="inlineMode" />
    }
    <!-- Input for Range ONLY -->
    <ng-template #tplRangeInput let-partType="partType">
      <input
        #rangePickerInput
        [attr.id]="id"
        [disabled]="disabled"
        [readOnly]="inputReadOnly"
        [size]="inputSize"
        autocomplete="off"
        (click)="onClickInputBox($event)"
        (focusout)="onFocusout($event)"
        (focus)="onFocus($event, partType)"
        (keyup.enter)="onKeyupEnter($event)"
        [(ngModel)]="inputValue[datePickerService.getActiveIndex(partType)]"
        (ngModelChange)="onInputChange($event)"
        placeholder="{{ getPlaceholder(partType) }}"
      />
    </ng-template>

    <!-- Right operator icons -->
    <ng-template #tplRightRest>
      <div class="{{ prefixCls }}-active-bar" [style]="activeBarStyle"></div>
      @if (showClear) {
        <span class="{{ prefixCls }}-clear" (click)="onClickClear($event)">
          <tri-icon type="close-circle" theme="fill" />
        </span>
      }

      <span class="{{ prefixCls }}-suffix">
        <ng-container *stringTemplateOutlet="suffixIcon; let suffixIcon">
          <tri-icon [type]="suffixIcon" />
        </ng-container>
        @if (hasFeedback && !!status) {
          <tri-form-item-feedback-icon [status]="status" />
        }
      </span>
    </ng-template>

    <ng-template #inlineMode>
      <div
        class="{{ prefixCls }}-dropdown {{ dropdownClassName }}"
        [class.tri-picker-dropdown-rtl]="dir === 'rtl'"
        [class.tri-picker-dropdown-placement-bottomLeft]="currentPositionY === 'bottom' && currentPositionX === 'start'"
        [class.tri-picker-dropdown-placement-topLeft]="currentPositionY === 'top' && currentPositionX === 'start'"
        [class.tri-picker-dropdown-placement-bottomRight]="currentPositionY === 'bottom' && currentPositionX === 'end'"
        [class.tri-picker-dropdown-placement-topRight]="currentPositionY === 'top' && currentPositionX === 'end'"
        [class.tri-picker-dropdown-range]="isRange"
        [class.tri-picker-active-left]="datePickerService.activeInput === 'left'"
        [class.tri-picker-active-right]="datePickerService.activeInput === 'right'"
        [style]="popupStyle"
      >
        <date-range-popup
          [isRange]="isRange"
          [inline]="inline"
          [defaultPickerValue]="defaultPickerValue"
          [showWeek]="showWeekNumber || mode === 'week'"
          [panelMode]="panelMode"
          (panelModeChange)="onPanelModeChange($event)"
          (calendarChange)="onCalendarChange($event)"
          [locale]="locale?.lang!"
          [showToday]="mode === 'date' && showToday && !isRange && !showTime"
          [showNow]="mode === 'date' && showNow && !isRange && !!showTime"
          [showTime]="showTime"
          [dateRender]="dateRender"
          [disabledDate]="disabledDate"
          [disabledTime]="disabledTime"
          [extraFooter]="extraFooter"
          [ranges]="ranges"
          [dir]="dir"
          [format]="format"
          (resultOk)="onResultOk()"
        />
      </div>
    </ng-template>

    <!-- Overlay -->
    <ng-template
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="backdrop"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="realOpenState"
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-picker-wrapper'"
      (positionChange)="onPositionChange($event)"
      (detach)="close()"
      (overlayKeydown)="onOverlayKeydown($event)"
    >
      <div
        class="tri-picker-wrapper"
        [noAnimation]="!!noAnimation?.nzNoAnimation"
        [@slideMotion]="'enter'"
        [style.position]="'relative'"
      >
        <ng-container *ngTemplateOutlet="inlineMode"></ng-container>
      </div>
    </ng-template>
  `,
  host: {
    '[class.tri-picker]': `true`,
    '[class.tri-picker-range]': `isRange`,
    '[class.tri-picker-large]': `finalSize() === 'large'`,
    '[class.tri-picker-small]': `finalSize() === 'small'`,
    '[class.tri-picker-disabled]': `disabled`,
    '[class.tri-picker-rtl]': `dir === 'rtl'`,
    '[class.tri-picker-borderless]': `variant === 'borderless' || (variant === 'outlined' && borderless)`,
    '[class.tri-picker-filled]': `variant === 'filled'`,
    '[class.tri-picker-underlined]': `variant === 'underlined'`,
    '[class.tri-picker-inline]': `inline`,
    '(click)': 'onClickInputBox($event)'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  providers: [
    DatePickerService,
    { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'picker' },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TriDatePickerComponent)
    }
  ],
  animations: [slideMotion],
  imports: [
    FormsModule,
    NgTemplateOutlet,
    TriOutletModule,
    TriIconModule,
    TriFormItemFeedbackIconComponent,
    DateRangePopupComponent,
    CdkConnectedOverlay,
    TriOverlayModule,
    TriNoAnimationDirective
  ]
})
export class TriDatePickerComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {
  public configService = inject(TriConfigService);
  public datePickerService = inject(DatePickerService);
  protected i18n = inject(TriI18nService);
  protected cdr = inject(ChangeDetectorRef);
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef<HTMLElement>);
  private dateHelper = inject(DateHelperService);
  private resizeObserver = inject(TriResizeObserver);
  private platform = inject(Platform);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  static ngAcceptInputType_nzShowTime: BooleanInput | SupportTimeOptions | null | undefined;
  static ngAcceptInputType_nzMode: TriDateMode | string;

  isRange: boolean = false; // Indicate whether the value is a range value
  extraFooter?: TemplateRef<TriSafeAny> | string;
  dir: Direction = 'ltr';

  // status
  statusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;

  public panelMode: TriDateMode | TriDateMode[] = 'date';
  private isCustomPlaceHolder: boolean = false;
  private isCustomFormat: boolean = false;
  #showTime: SupportTimeOptions | boolean = false;
  private isNzDisableFirstChange: boolean = true;
  // --- Common API
  @Input({ transform: booleanAttribute }) allowClear: boolean = true;
  @Input({ transform: booleanAttribute }) autoFocus: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  /**
   * @deprecated Will be removed in v21. It is recommended to use `nzVariant` instead.
   */
  @Input({ transform: booleanAttribute }) borderless: boolean = false;
  @Input({ transform: booleanAttribute }) inputReadOnly: boolean = false;
  @Input({ transform: booleanAttribute }) inline: boolean = false;
  @Input({ transform: booleanAttribute }) open?: boolean;
  @Input() disabledDate?: (d: Date) => boolean;
  @Input() locale!: TriDatePickerI18nInterface;
  @Input() placeHolder: string | string[] = '';
  @Input() popupStyle: object = POPUP_STYLE_PATCH;
  @Input() dropdownClassName?: string;
  @Input() size: TriDatePickerSizeType = 'default';
  @Input() status: TriStatus = '';
  @Input() format!: string;
  @Input() @WithConfig() variant: TriVariant = 'outlined';
  @Input() dateRender?: TemplateRef<TriSafeAny> | string | FunctionProp<TemplateRef<Date> | string>;
  @Input() disabledTime?: DisabledTimeFn;
  @Input() renderExtraFooter?: TemplateRef<TriSafeAny> | string | FunctionProp<TemplateRef<TriSafeAny> | string>;
  @Input({ transform: booleanAttribute }) showToday: boolean = true;
  @Input() mode: TriDateMode = 'date';
  @Input({ transform: booleanAttribute }) showNow: boolean = true;
  @Input() ranges?: PresetRanges;
  @Input() defaultPickerValue: CompatibleDate | null = null;
  @Input() @WithConfig() separator?: string | TemplateRef<TriSafeAny> = undefined;
  @Input() @WithConfig() suffixIcon: string | TemplateRef<TriSafeAny> = 'calendar';
  @Input() @WithConfig() backdrop = false;
  @Input() id: string | null = null;
  @Input() placement: TriPlacement = 'bottomLeft';
  @Input({ transform: booleanAttribute }) showWeekNumber: boolean = false;

  @Output() readonly onPanelChange = new EventEmitter<TriPanelChangeType>();
  @Output() readonly onCalendarChange = new EventEmitter<Array<Date | null>>();
  @Output() readonly onOk = new EventEmitter<CompatibleDate | null>();
  @Output() readonly onOpenChange = new EventEmitter<boolean>();

  @Input() get showTime(): SupportTimeOptions | boolean {
    return this.#showTime;
  }

  set showTime(value: SupportTimeOptions | boolean) {
    this.#showTime = typeof value === 'object' ? value : toBoolean(value);
  }

  // ------------------------------------------------------------------------
  // Input API Start
  // ------------------------------------------------------------------------
  @ViewChild(CdkConnectedOverlay, { static: false }) cdkConnectedOverlay?: CdkConnectedOverlay;
  @ViewChild(DateRangePopupComponent, { static: false }) panel!: DateRangePopupComponent;
  @ViewChild('separatorElement', { static: false }) separatorElement?: ElementRef;
  @ViewChild('pickerInput', { static: false }) pickerInput?: ElementRef<HTMLInputElement>;
  @ViewChildren('rangePickerInput') rangePickerInputs?: QueryList<ElementRef<HTMLInputElement>>;

  get origin(): ElementRef {
    return this.elementRef;
  }

  inputSize: number = 12;
  inputWidth?: number;
  prefixCls = PREFIX_CLASS;
  inputValue!: TriSafeAny;
  activeBarStyle: object = {};
  overlayOpen: boolean = false; // Available when "nzOpen" = undefined
  overlayPositions: ConnectionPositionPair[] = [...DEFAULT_DATE_PICKER_POSITIONS];
  currentPositionX: HorizontalConnectionPos = 'start';
  currentPositionY: VerticalConnectionPos = 'bottom';

  get realOpenState(): boolean {
    // The value that really decide the open state of overlay
    return this.isOpenHandledByUser() ? !!this.open : this.overlayOpen;
  }

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private document: Document = inject(DOCUMENT);

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.focus();
    }

    if (this.isRange && this.platform.isBrowser) {
      this.resizeObserver
        .observe(this.elementRef)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.updateInputWidthAndArrowLeft();
        });
    }

    this.datePickerService.inputPartChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(partType => {
      if (partType) {
        this.datePickerService.activeInput = partType;
      }
      this.focus();
      this.updateInputWidthAndArrowLeft();
    });

    if (this.platform.isBrowser) {
      // prevent mousedown event to trigger focusout event when click in date picker
      // see: https://github.com/NG-ZORRO/ng-zorro-antd/issues/7450
      fromEventOutsideAngular(this.elementRef.nativeElement, 'mousedown')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(event => {
          if ((event.target as HTMLInputElement).tagName.toLowerCase() !== 'input') {
            event.preventDefault();
          }
        });
    }
  }

  updateInputWidthAndArrowLeft(): void {
    this.inputWidth = this.rangePickerInputs?.first?.nativeElement.offsetWidth || 0;

    const baseStyle = { position: 'absolute', width: `${this.inputWidth}px` };
    this.datePickerService.arrowLeft =
      this.datePickerService.activeInput === 'left'
        ? 0
        : this.inputWidth + this.separatorElement?.nativeElement.offsetWidth || 0;

    if (this.dir === 'rtl') {
      this.activeBarStyle = { ...baseStyle, right: `${this.datePickerService.arrowLeft}px` };
    } else {
      this.activeBarStyle = { ...baseStyle, left: `${this.datePickerService.arrowLeft}px` };
    }

    this.cdr.markForCheck();
  }

  getInput(partType?: RangePartType): HTMLInputElement | undefined {
    if (this.inline) {
      return undefined;
    }
    return this.isRange
      ? partType === 'left'
        ? this.rangePickerInputs?.first.nativeElement
        : this.rangePickerInputs?.last.nativeElement
      : this.pickerInput!.nativeElement;
  }

  focus(): void {
    const activeInputElement = this.getInput(this.datePickerService.activeInput);
    if (this.document.activeElement !== activeInputElement) {
      activeInputElement?.focus();
    }
  }

  onFocus(event: FocusEvent, partType?: RangePartType): void {
    event.preventDefault();
    if (partType) {
      this.datePickerService.inputPartChange$.next(partType);
    }
    this.renderClass(true);
  }

  // blur event has not the relatedTarget in IE11, use focusout instead.
  onFocusout(event: FocusEvent): void {
    event.preventDefault();
    this.onTouchedFn();
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
      this.checkAndClose();
    }
    this.renderClass(false);
  }

  // Show overlay content
  _open(): void {
    if (this.inline) {
      return;
    }
    if (!this.realOpenState && !this.disabled) {
      this.updateInputWidthAndArrowLeft();
      this.overlayOpen = true;
      this.onOpenChange.emit(true);
      this.focus();
      this.cdr.markForCheck();
    }
  }

  close(): void {
    if (this.inline) {
      return;
    }
    if (this.realOpenState) {
      this.overlayOpen = false;
      this.onOpenChange.emit(false);
    }
  }

  get showClear(): boolean {
    return !this.disabled && !this.isEmptyValue(this.datePickerService.value) && this.allowClear;
  }

  checkAndClose(): void {
    if (!this.realOpenState) {
      return;
    }

    if (this.panel.isAllowed(this.datePickerService.value!, true)) {
      if (Array.isArray(this.datePickerService.value) && wrongSortOrder(this.datePickerService.value)) {
        const index = this.datePickerService.getActiveIndex();
        const value = this.datePickerService.value[index];
        this.panel.changeValueFromSelect(value!, true);
        return;
      }
      this.updateInputValue();
      this.datePickerService.emitValue$.next();
    } else {
      this.datePickerService.setValue(this.datePickerService.initialValue!);
      this.close();
    }
  }

  onClickInputBox(event: MouseEvent): void {
    event.stopPropagation();
    this.focus();
    if (!this.isOpenHandledByUser()) {
      this._open();
    }
  }

  onOverlayKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ESCAPE) {
      this.datePickerService.initValue();
    }
  }

  // NOTE: A issue here, the first time position change, the animation will not be triggered.
  // Because the overlay's "positionChange" event is emitted after the content's full shown up.
  // All other components like "nz-dropdown" which depends on overlay also has the same issue.
  // See: https://github.com/NG-ZORRO/ng-zorro-antd/issues/1429
  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.currentPositionX = position.connectionPair.originX;
    this.currentPositionY = position.connectionPair.originY;
    this.cdr.detectChanges(); // Take side effects to position styles
  }

  onClickClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.datePickerService.initValue(true);
    this.datePickerService.emitValue$.next();
  }

  updateInputValue(): void {
    const newValue = this.datePickerService.value;
    if (this.isRange) {
      this.inputValue = newValue ? (newValue as CandyDate[]).map(v => this.formatValue(v)) : ['', ''];
    } else {
      this.inputValue = this.formatValue(newValue as CandyDate);
    }
    this.cdr.markForCheck();
  }

  formatValue(value: CandyDate): string {
    return this.dateHelper.format(value && (value as CandyDate).nativeDate, this.format);
  }

  onInputChange(value: string, isEnter: boolean = false): void {
    /**
     * in IE11 focus/blur will trigger ngModelChange if placeholder changes,
     * so we forbid IE11 to open panel through input change
     */
    if (
      !this.platform.TRIDENT &&
      this.document.activeElement === this.getInput(this.datePickerService.activeInput) &&
      !this.realOpenState
    ) {
      this._open();
      return;
    }

    const date = this.checkValidDate(value);
    // Can only change date when it's open
    if (date && this.realOpenState) {
      this.panel.changeValueFromSelect(date, isEnter);
    }
  }

  onKeyupEnter(event: Event): void {
    this.onInputChange((event.target as HTMLInputElement).value, true);
  }

  private checkValidDate(value: string): CandyDate | null {
    const date = new CandyDate(this.dateHelper.parseDate(value, this.format));

    if (!date.isValid() || value !== this.dateHelper.format(date.nativeDate, this.format)) {
      return null;
    }

    return date;
  }

  getPlaceholder(partType?: RangePartType): string {
    return this.isRange
      ? this.placeHolder[this.datePickerService.getActiveIndex(partType!)]
      : (this.placeHolder as string);
  }

  isEmptyValue(value: CompatibleValue): boolean {
    if (value === null) {
      return true;
    } else if (this.isRange) {
      return !value || !Array.isArray(value) || value.every(val => !val);
    } else {
      return !value;
    }
  }

  // Whether open state is permanently controlled by user himself
  isOpenHandledByUser(): boolean {
    return this.open !== undefined;
  }

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  // ------------------------------------------------------------------------
  // Input API End
  // ------------------------------------------------------------------------

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        withLatestFrom(this.formNoStatusService ? this.formNoStatusService.noFormStatus : of(false)),
        map(([{ status, hasFeedback }, noStatus]) => ({ status: noStatus ? '' : status, hasFeedback })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    // Subscribe the every locale change if the nzLocale is not handled by user
    if (!this.locale) {
      this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.setLocale());
    }

    // Default value
    this.datePickerService.isRange = this.isRange;
    this.datePickerService.initValue(true);
    this.datePickerService.emitValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const granularityComparison = this.#showTime ? 'second' : 'day';
      const value = this.datePickerService.value;
      const datePickerPreviousValue = this.datePickerService.initialValue;

      // Check if the value has change for a simple datepicker, let us avoid notify the control for nothing
      if (
        !this.isRange &&
        (value as CandyDate)?.isSame((datePickerPreviousValue as CandyDate)?.nativeDate, granularityComparison)
      ) {
        this.onTouchedFn();
        return this.close();
      }

      // check if the value has change for a range picker, let us avoid notify the control for nothing
      if (this.isRange) {
        const [previousStartDate, previousEndDate] = datePickerPreviousValue as CandyDate[];
        const [currentStartDate, currentEndDate] = value as CandyDate[];
        if (
          previousStartDate?.isSame(currentStartDate?.nativeDate, granularityComparison) &&
          previousEndDate?.isSame(currentEndDate?.nativeDate, granularityComparison)
        ) {
          this.onTouchedFn();
          return this.close();
        }
      }

      this.datePickerService.initialValue = cloneDate(value);
      if (this.isRange) {
        const vAsRange = value as CandyDate[];
        if (vAsRange.length) {
          this.onChangeFn([vAsRange[0]?.nativeDate ?? null, vAsRange[1]?.nativeDate ?? null]);
        } else {
          this.onChangeFn([]);
        }
      } else {
        if (value) {
          this.onChangeFn((value as CandyDate).nativeDate);
        } else {
          this.onChangeFn(null);
        }
      }
      this.onTouchedFn();
      // When value emitted, overlay will be closed
      this.close();
    });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
    this.inputValue = this.isRange ? ['', ''] : '';
    this.setModeAndFormat();

    this.datePickerService.valueChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateInputValue();
    });
  }

  ngOnChanges({
    nzStatus,
    nzPlacement,
    nzPopupStyle,
    nzPlaceHolder,
    nzLocale,
    nzFormat,
    nzRenderExtraFooter,
    nzMode,
    nzSize
  }: SimpleChanges): void {
    if (nzPopupStyle) {
      // Always assign the popup style patch
      this.popupStyle = this.popupStyle ? { ...this.popupStyle, ...POPUP_STYLE_PATCH } : POPUP_STYLE_PATCH;
    }

    // Mark as customized placeholder by user once nzPlaceHolder assigned at the first time
    if (nzPlaceHolder?.currentValue) {
      this.isCustomPlaceHolder = true;
    }

    if (nzFormat?.currentValue) {
      this.isCustomFormat = true;
      this.updateInputValue();
    }

    if (nzLocale) {
      // The nzLocale is currently handled by user
      this.setDefaultPlaceHolder();
    }

    if (nzRenderExtraFooter) {
      this.extraFooter = valueFunctionProp(this.renderExtraFooter!);
    }

    if (nzMode) {
      this.setDefaultPlaceHolder();
      this.setModeAndFormat();
    }

    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }

    if (nzPlacement) {
      this.setPlacement(this.placement);
    }

    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  setModeAndFormat(): void {
    const inputFormats: Partial<Record<TriDateMode, string>> = {
      year: 'yyyy',
      quarter: 'yyyy-[Q]Q',
      month: 'yyyy-MM',
      week: 'YYYY-ww',
      date: this.showTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
    };

    if (!this.mode) {
      this.mode = 'date';
    }

    this.panelMode = this.isRange ? [this.mode, this.mode] : this.mode;

    // Default format when it's empty
    if (!this.isCustomFormat) {
      this.format = inputFormats[this.mode as TriDateMode]!;
    }

    this.inputSize = Math.max(10, this.format.length) + 2;
    this.updateInputValue();
  }

  /**
   * Triggered when overlayOpen changes (different with realOpenState)
   *
   * @param open The overlayOpen in picker component
   */
  _onOpenChange(open: boolean): void {
    this.onOpenChange.emit(open);
  }

  // ------------------------------------------------------------------------
  // | Control value accessor implements
  // ------------------------------------------------------------------------

  // NOTE: onChangeFn/onTouchedFn will not be assigned if user not use as ngModel
  onChangeFn: OnChangeType = () => void 0;
  onTouchedFn: OnTouchedType = () => void 0;

  writeValue(value: CompatibleDate): void {
    this.setValue(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.cdr.markForCheck();
    this.isNzDisableFirstChange = false;
  }

  // ------------------------------------------------------------------------
  // | Internal methods
  // ------------------------------------------------------------------------

  // Reload locale from i18n with side effects
  private setLocale(): void {
    this.locale = this.i18n.getLocaleData('DatePicker', {});
    this.setDefaultPlaceHolder();
    this.cdr.markForCheck();
  }

  private setDefaultPlaceHolder(): void {
    if (!this.isCustomPlaceHolder && this.locale) {
      const defaultPlaceholder: Partial<Record<TriDateMode, string>> = {
        year: this.getPropertyOfLocale('yearPlaceholder'),
        quarter: this.getPropertyOfLocale('quarterPlaceholder'),
        month: this.getPropertyOfLocale('monthPlaceholder'),
        week: this.getPropertyOfLocale('weekPlaceholder'),
        date: this.getPropertyOfLocale('placeholder')
      };

      const defaultRangePlaceholder: Partial<Record<TriDateMode, string[]>> = {
        year: this.getPropertyOfLocale('rangeYearPlaceholder'),
        quarter: this.getPropertyOfLocale('rangeQuarterPlaceholder'),
        month: this.getPropertyOfLocale('rangeMonthPlaceholder'),
        week: this.getPropertyOfLocale('rangeWeekPlaceholder'),
        date: this.getPropertyOfLocale('rangePlaceholder')
      };

      this.placeHolder = this.isRange
        ? defaultRangePlaceholder[this.mode as TriDateMode]!
        : defaultPlaceholder[this.mode as TriDateMode]!;
    }
  }

  private getPropertyOfLocale<T extends keyof TriDatePickerLangI18nInterface>(
    type: T
  ): TriDatePickerLangI18nInterface[T] {
    return this.locale.lang[type] || this.i18n.getLocaleData(`DatePicker.lang.${type}`);
  }

  // Safe way of setting value with default
  private setValue(value: CompatibleDate): void {
    const newValue = this.datePickerService.makeValue(value);
    this.datePickerService.setValue(newValue);
    this.datePickerService.initialValue = cloneDate(newValue);
    this.cdr.detectChanges();
  }

  renderClass(value: boolean): void {
    // TODO: avoid autoFocus cause change after checked error
    if (value) {
      this.renderer.addClass(this.elementRef.nativeElement, 'ant-picker-focused');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'ant-picker-focused');
    }
  }

  onPanelModeChange(panelChange: TriPanelChangeType): void {
    this.onPanelChange.emit(panelChange);
  }

  // Emit nzOnCalendarChange when select date by nz-range-picker
  _onCalendarChange(value: CompatibleValue): void {
    if (this.isRange && Array.isArray(value)) {
      const rangeValue = value.filter(x => x instanceof CandyDate).map(x => x!.nativeDate);
      this.onCalendarChange.emit(rangeValue);
    }
  }

  onResultOk(): void {
    if (this.isRange) {
      const value = this.datePickerService.value as CandyDate[];
      if (value.length) {
        this.onOk.emit([value[0]?.nativeDate || null, value[1]?.nativeDate || null]);
      } else {
        this.onOk.emit([]);
      }
    } else {
      if (this.datePickerService.value) {
        this.onOk.emit((this.datePickerService.value as CandyDate).nativeDate);
      } else {
        this.onOk.emit(null);
      }
    }
  }

  // status
  private setStatusStyles(status: TriValidateStatus, hasFeedback: boolean): void {
    // set inner status
    this._status = status;
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
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

  private setPlacement(placement: TriPlacement): void {
    const position: ConnectionPositionPair = DATE_PICKER_POSITION_MAP[placement];
    this.overlayPositions = [position, ...DEFAULT_DATE_PICKER_POSITIONS];
    this.currentPositionX = position.originX;
    this.currentPositionY = position.originY;
  }
}
