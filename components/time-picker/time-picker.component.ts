/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { Platform, _getEventTarget } from '@angular/cdk/platform';
import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  signal,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { isValid } from 'date-fns';

import { slideMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { warn } from 'ng-zorro-antd/core/logger';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriOverlayModule } from 'ng-zorro-antd/core/overlay';
import {
  NgClassInterface,
  TriSafeAny,
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  TriVariant
} from 'ng-zorro-antd/core/types';
import { getStatusClassNames, isNil } from 'ng-zorro-antd/core/util';
import { DateHelperService, TriI18nService } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriTimePickerPanelComponent } from './time-picker-panel.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'timePicker';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tri-time-picker',
  exportAs: 'triTimePicker',
  template: `
    <div class="tri-picker-input">
      <input
        #inputElement
        [attr.id]="id"
        type="text"
        [size]="inputSize"
        autocomplete="off"
        [placeholder]="placeHolder || (i18nPlaceHolder$ | async)"
        [(ngModel)]="inputValue"
        [disabled]="disabled"
        [readOnly]="inputReadOnly"
        (focus)="onFocus(true)"
        (blur)="onFocus(false)"
        (keyup.enter)="onKeyupEnter()"
        (keyup.escape)="onKeyupEsc()"
        (ngModelChange)="onInputChange($event)"
      />
      <span class="tri-picker-suffix">
        <ng-container *stringTemplateOutlet="suffixIcon; let suffixIcon">
          <tri-icon [type]="suffixIcon" />
        </ng-container>
        @if (hasFeedback && !!status) {
          <tri-form-item-feedback-icon [status]="status"></tri-form-item-feedback-icon>
        }
      </span>
      @if (allowEmpty && !disabled && value) {
        <span class="tri-picker-clear" (click)="onClickClearBtn($event)">
          <tri-icon type="close-circle" theme="fill" [attr.aria-label]="clearText" [attr.title]="clearText" />
        </span>
      }
    </div>

    <ng-template
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="backdrop"
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-picker-dropdown'"
      (detach)="close()"
      (overlayOutsideClick)="onClickOutside($event)"
    >
      <div [@slideMotion]="'enter'" class="tri-picker-dropdown" style="position: relative">
        <div class="tri-picker-panel-container">
          <div tabindex="-1" class="tri-picker-panel">
            <tri-time-picker-panel
              [class]="popupClassName"
              [format]="format"
              [hourStep]="hourStep"
              [minuteStep]="minuteStep"
              [secondStep]="secondStep"
              [disabledHours]="disabledHours"
              [disabledMinutes]="disabledMinutes"
              [disabledSeconds]="disabledSeconds"
              [placeHolder]="placeHolder || (i18nPlaceHolder$ | async)"
              [hideDisabledOptions]="hideDisabledOptions"
              [use12Hours]="use12Hours"
              [defaultOpenValue]="defaultOpenValue"
              [addOn]="addOn"
              [clearText]="clearText"
              [nowText]="nowText"
              [okText]="okText"
              [allowEmpty]="allowEmpty"
              [(ngModel)]="value"
              (ngModelChange)="onPanelValueChange($event)"
              (closePanel)="closePanel()"
            ></tri-time-picker-panel>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  host: {
    class: 'tri-picker',
    '[class.tri-picker-large]': `finalSize() === 'large'`,
    '[class.tri-picker-small]': `finalSize() === 'small'`,
    '[class.tri-picker-disabled]': `disabled`,
    '[class.tri-picker-focused]': `focused`,
    '[class.tri-picker-rtl]': `dir === 'rtl'`,
    '[class.tri-picker-borderless]': `variant === 'borderless' || (variant === 'outlined' && borderless)`,
    '[class.tri-picker-filled]': `variant === 'filled'`,
    '[class.tri-picker-underlined]': `variant === 'underlined'`,
    '(click)': 'open()'
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  animations: [slideMotion],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriTimePickerComponent),
      multi: true
    },
    {
      provide: TRI_SPACE_COMPACT_ITEM_TYPE,
      useValue: 'picker'
    }
  ],
  imports: [
    AsyncPipe,
    FormsModule,
    TriOutletModule,
    TriIconModule,
    TriFormItemFeedbackIconComponent,
    TriTimePickerPanelComponent,
    TriOverlayModule,
    OverlayModule
  ]
})
export class TriTimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  public configService = inject(TriConfigService);
  protected i18n = inject(TriI18nService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  private dateHelper = inject(DateHelperService);
  private platform = inject(Platform);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  private _onChange?: (value: Date | null) => void;
  private _onTouched?: () => void;
  private isNzDisableFirstChange: boolean = true;
  isInit = false;
  focused = false;
  inputValue: string = '';
  value: Date | null = null;
  preValue: Date | null = null;
  inputSize?: number;
  i18nPlaceHolder$: Observable<string | undefined> = of(undefined);
  overlayPositions: ConnectionPositionPair[] = [
    {
      offsetY: 3,
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    },
    {
      offsetY: -3,
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom'
    },
    {
      offsetY: 3,
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top'
    },
    {
      offsetY: -3,
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom'
    }
  ] as ConnectionPositionPair[];
  dir: Direction = 'ltr';
  // status
  prefixCls: string = 'ant-picker';
  statusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;

  get origin(): ElementRef {
    return this.elementRef;
  }

  @ViewChild('inputElement', { static: true }) inputRef!: ElementRef<HTMLInputElement>;
  @Input() id: string | null = null;
  @Input() size: TriSizeLDSType = 'default';
  @Input() status: TriStatus = '';
  @Input() @WithConfig() variant: TriVariant = 'outlined';
  @Input() @WithConfig() hourStep: number = 1;
  @Input() @WithConfig() minuteStep: number = 1;
  @Input() @WithConfig() secondStep: number = 1;
  @Input() @WithConfig() clearText: string = 'clear';
  @Input() @WithConfig() nowText: string = '';
  @Input() @WithConfig() okText: string = '';
  @Input() @WithConfig() popupClassName: string = '';
  @Input() placeHolder = '';
  @Input() addOn?: TemplateRef<void>;
  @Input() defaultOpenValue?: Date;
  @Input() disabledHours?: () => number[];
  @Input() disabledMinutes?: (hour: number) => number[];
  @Input() disabledSeconds?: (hour: number, minute: number) => number[];
  @Input() @WithConfig() format: string = 'HH:mm:ss';
  @Input() open = false;
  @Input({ transform: booleanAttribute }) @WithConfig() use12Hours: boolean = false;
  @Input() @WithConfig() suffixIcon: string | TemplateRef<TriSafeAny> = 'clock-circle';

  @Output() readonly openChange = new EventEmitter<boolean>();

  @Input({ transform: booleanAttribute }) hideDisabledOptions = false;
  @Input({ transform: booleanAttribute }) @WithConfig() allowEmpty: boolean = true;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) autoFocus = false;
  @Input() @WithConfig() backdrop = false;
  /**
   * @deprecated Will be removed in v21. It is recommended to use `nzVariant` instead.
   */
  @Input({ transform: booleanAttribute }) borderless: boolean = false;
  @Input({ transform: booleanAttribute }) inputReadOnly: boolean = false;

  emitValue(value: Date | null): void {
    this.setValue(value, true);

    if (this._onChange) {
      this._onChange(this.value);
    }

    if (this._onTouched) {
      this._onTouched();
    }
  }

  setValue(value: Date | null, syncPreValue: boolean = false): void {
    if (syncPreValue) {
      this.preValue = isValid(value) ? new Date(value!) : null;
    }
    this.value = isValid(value) ? new Date(value!) : null;
    this.inputValue = this.dateHelper.format(value, this.format);
    this.cdr.markForCheck();
  }

  _open(): void {
    if (this.disabled || this.open) {
      return;
    }
    this.focus();
    this.open = true;
    this.openChange.emit(this.open);
  }

  close(): void {
    this.open = false;
    this.cdr.markForCheck();
    this.openChange.emit(this.open);
  }

  updateAutoFocus(): void {
    if (this.isInit && !this.disabled) {
      if (this.autoFocus) {
        this.renderer.setAttribute(this.inputRef.nativeElement, 'autofocus', 'autofocus');
      } else {
        this.renderer.removeAttribute(this.inputRef.nativeElement, 'autofocus');
      }
    }
  }

  onClickClearBtn(event: MouseEvent): void {
    event.stopPropagation();
    this.emitValue(null);
  }

  onClickOutside(event: MouseEvent): void {
    const target = _getEventTarget(event);
    if (!this.elementRef.nativeElement.contains(target)) {
      this.setCurrentValueAndClose();
    }
  }

  onFocus(value: boolean): void {
    this.focused = value;
    if (!value) {
      if (this.checkTimeValid(this.value)) {
        this.setCurrentValueAndClose();
      } else {
        this.setValue(this.preValue);
        this.close();
      }
    }
  }

  focus(): void {
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.focus();
    }
  }

  blur(): void {
    if (this.inputRef.nativeElement) {
      this.inputRef.nativeElement.blur();
    }
  }

  onKeyupEsc(): void {
    this.setValue(this.preValue);
  }

  onKeyupEnter(): void {
    if (this.open && isValid(this.value)) {
      this.setCurrentValueAndClose();
    } else if (!this.open) {
      this._open();
    }
  }

  onInputChange(str: string): void {
    if (!this.platform.TRIDENT && document.activeElement === this.inputRef.nativeElement) {
      this._open();
      this.parseTimeString(str);
    }
  }

  onPanelValueChange(value: Date): void {
    this.setValue(value);
    this.focus();
  }

  closePanel(): void {
    this.inputRef.nativeElement.blur();
  }

  setCurrentValueAndClose(): void {
    this.emitValue(this.value);
    this.close();
  }

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => pre.status === cur.status && pre.hasFeedback === cur.hasFeedback),
        withLatestFrom(this.formNoStatusService ? this.formNoStatusService.noFormStatus : of(false)),
        map(([{ status, hasFeedback }, noStatus]) => ({ status: noStatus ? '' : status, hasFeedback })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.inputSize = Math.max(8, this.format.length) + 2;
    this.i18nPlaceHolder$ = this.i18n.localeChange.pipe(map(nzLocale => nzLocale.TimePicker.placeholder));

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });
  }

  ngOnChanges({ nzUse12Hours, nzFormat, nzDisabled, nzAutoFocus, nzStatus, nzSize }: SimpleChanges): void {
    if (nzUse12Hours && !nzUse12Hours.previousValue && nzUse12Hours.currentValue && !nzFormat) {
      this.format = 'h:mm:ss a';
    }
    if (nzDisabled) {
      const value = nzDisabled.currentValue;
      const input = this.inputRef.nativeElement as HTMLInputElement;
      if (value) {
        this.renderer.setAttribute(input, 'disabled', '');
      } else {
        this.renderer.removeAttribute(input, 'disabled');
      }
    }
    if (nzAutoFocus) {
      this.updateAutoFocus();
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  parseTimeString(str: string): void {
    const value = this.dateHelper.parseTime(str, this.format) || null;
    if (isValid(value)) {
      this.value = value;
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this.isInit = true;
    this.updateAutoFocus();
  }

  writeValue(time: Date | null | undefined): void {
    let result: Date | null;

    if (time instanceof Date) {
      result = time;
    } else if (isNil(time)) {
      result = null;
    } else {
      warn('Non-Date type is not recommended for time-picker, use "Date" type.');
      result = new Date(time);
    }

    this.setValue(result, true);
  }

  registerOnChange(fn: (time: Date | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    this.cdr.markForCheck();
  }

  private checkTimeValid(value: Date | null): boolean {
    if (!value) {
      return true;
    }

    const disabledHours = this.disabledHours?.();
    const disabledMinutes = this.disabledMinutes?.(value.getHours());
    const disabledSeconds = this.disabledSeconds?.(value.getHours(), value.getMinutes());

    return !(
      disabledHours?.includes(value.getHours()) ||
      disabledMinutes?.includes(value.getMinutes()) ||
      disabledSeconds?.includes(value.getSeconds())
    );
  }

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
}
