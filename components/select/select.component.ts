/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import { _getEventTarget, Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  signal,
  output,
  DestroyRef,
  NgZone,
  ChangeDetectorRef,
  Renderer2
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, merge, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, withLatestFrom } from 'rxjs/operators';

import { slideMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { TriOverlayModule, POSITION_MAP, POSITION_TYPE, getPlacementName } from 'ng-zorro-antd/core/overlay';
import { cancelAnimationFrame, requestAnimationFrame } from 'ng-zorro-antd/core/polyfill';
import {
  NgClassInterface,
  TriSafeAny,
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  TriVariant,
  OnChangeType,
  OnTouchedType
} from 'ng-zorro-antd/core/types';
import {
  fromEventOutsideAngular,
  getStatusClassNames,
  isNotNil,
  numberAttributeWithInfinityFallback
} from 'ng-zorro-antd/core/util';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriOptionContainerComponent } from './option-container.component';
import { TriOptionGroupComponent } from './option-group.component';
import { TriOptionComponent } from './option.component';
import { TriSelectArrowComponent } from './select-arrow.component';
import { TriSelectClearComponent } from './select-clear.component';
import { TriSelectTopControlComponent } from './select-top-control.component';
import {
  TriFilterOptionType,
  TriSelectItemInterface,
  TriSelectModeType,
  TriSelectOptionInterface,
  TriSelectPlacementType
} from './select.types';

const defaultFilterOption: TriFilterOptionType = (searchValue: string, item: TriSelectItemInterface): boolean => {
  if (item && item.nzLabel) {
    return item.nzLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
};

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'select';

export type TriSelectSizeType = TriSizeLDSType;

@Component({
  selector: 'tri-select',
  exportAs: 'triSelect',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriSelectComponent),
      multi: true
    },
    { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'select' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideMotion],
  template: `
    <tri-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [id]="id"
      [open]="open"
      [disabled]="disabled"
      [mode]="mode"
      [@.disabled]="!!noAnimation?.nzNoAnimation"
      [noAnimation]="noAnimation?.nzNoAnimation"
      [maxTagPlaceholder]="maxTagPlaceholder"
      [removeIcon]="removeIcon"
      [placeHolder]="placeHolder"
      [maxTagCount]="maxTagCount"
      [customTemplate]="customTemplate"
      [tokenSeparators]="tokenSeparators"
      [showSearch]="showSearch"
      [autofocus]="autoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
    ></tri-select-top-control>
    @if (showArrow || (hasFeedback && !!status) || isMaxMultipleCountSet) {
      <tri-select-arrow
        [showArrow]="showArrow"
        [loading]="loading"
        [search]="open && showSearch"
        [suffixIcon]="suffixIcon"
        [feedbackIcon]="feedbackIconTpl"
        [maxMultipleCount]="maxMultipleCount"
        [listOfValue]="listOfValue"
        [isMaxMultipleCountSet]="isMaxMultipleCountSet"
      >
        <ng-template #feedbackIconTpl>
          @if (hasFeedback && !!status) {
            <tri-form-item-feedback-icon [status]="status"></tri-form-item-feedback-icon>
          }
        </ng-template>
      </tri-select-arrow>
    }

    @if (allowClear && !disabled && listOfValue.length) {
      <tri-select-clear [clearIcon]="clearIcon" (clear)="onClearSelection()"></tri-select-clear>
    }
    <ng-template
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="backdrop"
      [cdkConnectedOverlayMinWidth]="$any(dropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(dropdownMatchSelectWidth ? triggerWidth : null)"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-dropdown'"
      [cdkConnectedOverlayPanelClass]="dropdownClassName!"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
    >
      <tri-option-container
        [style]="dropdownStyle"
        [itemSize]="optionHeightPx"
        [maxItemLength]="optionOverflowSize"
        [matchWidth]="dropdownMatchSelectWidth"
        [class.tri-select-dropdown-placement-bottomLeft]="dropdownPosition === 'bottomLeft'"
        [class.tri-select-dropdown-placement-topLeft]="dropdownPosition === 'topLeft'"
        [class.tri-select-dropdown-placement-bottomRight]="dropdownPosition === 'bottomRight'"
        [class.tri-select-dropdown-placement-topRight]="dropdownPosition === 'topRight'"
        [@slideMotion]="'enter'"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [noAnimation]="noAnimation?.nzNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="menuItemSelectedIcon"
        [notFoundContent]="notFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="dropdownRender"
        [compareWith]="compareWith"
        [mode]="mode"
        [isMaxMultipleCountReached]="isMaxMultipleCountReached"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (scrollToBottom)="scrollToBottom.emit()"
      ></tri-option-container>
    </ng-template>
  `,
  host: {
    class: 'tri-select',
    '[class.tri-select-in-form-item]': '!!formStatusService',
    '[class.tri-select-lg]': 'finalSize() === "large"',
    '[class.tri-select-sm]': 'finalSize() === "small"',
    '[class.tri-select-show-arrow]': `showArrow`,
    '[class.tri-select-disabled]': 'disabled',
    '[class.tri-select-show-search]': `(showSearch || mode !== 'default') && !disabled`,
    '[class.tri-select-allow-clear]': 'allowClear',
    '[class.tri-select-borderless]': `variant === 'borderless' || (variant === 'outlined' && borderless)`,
    '[class.tri-select-filled]': `variant === 'filled'`,
    '[class.tri-select-underlined]': `variant === 'underlined'`,
    '[class.tri-select-open]': 'open',
    '[class.tri-select-focused]': 'open || focused',
    '[class.tri-select-single]': `mode === 'default'`,
    '[class.tri-select-multiple]': `mode !== 'default'`,
    '[class.tri-select-rtl]': `dir === 'rtl'`
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  imports: [
    TriSelectTopControlComponent,
    CdkOverlayOrigin,
    TriNoAnimationDirective,
    TriSelectArrowComponent,
    TriFormItemFeedbackIconComponent,
    TriSelectClearComponent,
    CdkConnectedOverlay,
    TriOverlayModule,
    TriOptionContainerComponent
  ]
})
export class TriSelectComponent implements ControlValueAccessor, OnInit, AfterContentInit, OnChanges {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly platform = inject(Platform);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @Input() id: string | null = null;
  @Input() size: TriSelectSizeType = 'default';
  @Input() status: TriStatus = '';
  @Input() @WithConfig() variant: TriVariant = 'outlined';
  @Input() @WithConfig() optionHeightPx = 32;
  @Input() optionOverflowSize = 8;
  @Input() dropdownClassName: string[] | string | null = null;
  @Input() dropdownMatchSelectWidth = true;
  @Input() dropdownStyle: Record<string, string> | null = null;
  @Input() notFoundContent: string | TemplateRef<TriSafeAny> | undefined = undefined;
  @Input() placeHolder: string | TemplateRef<TriSafeAny> | null = null;
  @Input() placement: TriSelectPlacementType | null = null;
  @Input() maxTagCount = Infinity;
  @Input() dropdownRender: TemplateRef<TriSafeAny> | null = null;
  @Input() customTemplate: TemplateRef<{ $implicit: TriSelectItemInterface }> | null = null;
  @Input()
  @WithConfig()
  suffixIcon: TemplateRef<TriSafeAny> | string | null = null;
  @Input() clearIcon: TemplateRef<TriSafeAny> | null = null;
  @Input() removeIcon: TemplateRef<TriSafeAny> | null = null;
  @Input() menuItemSelectedIcon: TemplateRef<TriSafeAny> | null = null;
  @Input() tokenSeparators: string[] = [];
  @Input() maxTagPlaceholder: TemplateRef<{ $implicit: TriSafeAny[] }> | null = null;
  @Input({ transform: numberAttributeWithInfinityFallback }) maxMultipleCount = Infinity;
  @Input() mode: TriSelectModeType = 'default';
  @Input() filterOption: TriFilterOptionType = defaultFilterOption;
  @Input() compareWith: (o1: TriSafeAny, o2: TriSafeAny) => boolean = (o1: TriSafeAny, o2: TriSafeAny) => o1 === o2;
  @Input({ transform: booleanAttribute }) allowClear = false;
  /**
   * @deprecated Will be removed in v21. It is recommended to use `nzVariant` instead.
   */
  @Input({ transform: booleanAttribute }) @WithConfig() borderless = false;
  @Input({ transform: booleanAttribute }) showSearch = false;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) autoFocus = false;
  @Input({ transform: booleanAttribute }) autoClearSearchValue = true;
  @Input({ transform: booleanAttribute }) serverSearch = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) open = false;
  @Input({ transform: booleanAttribute }) selectOnTab = false;
  @Input({ transform: booleanAttribute }) @WithConfig() backdrop = false;
  @Input() options: TriSelectOptionInterface[] = [];

  @Input({ transform: booleanAttribute })
  set showArrow(value: boolean) {
    this._nzShowArrow = value;
  }
  get showArrow(): boolean {
    return this._nzShowArrow === undefined ? this.mode === 'default' : this._nzShowArrow;
  }

  get isMultiple(): boolean {
    return this.mode === 'multiple' || this.mode === 'tags';
  }

  get isMaxMultipleCountSet(): boolean {
    return this.isMultiple && this.maxMultipleCount !== Infinity;
  }

  get isMaxMultipleCountReached(): boolean {
    return this.maxMultipleCount !== Infinity && this.listOfValue.length === this.maxMultipleCount;
  }

  @Output() readonly onSearch = new EventEmitter<string>();
  @Output() readonly scrollToBottom = new EventEmitter<void>();
  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly blur = new EventEmitter<void>();
  @Output() readonly focus = new EventEmitter<void>();
  readonly onClear = output<void>();
  @ViewChild(CdkOverlayOrigin, { static: true, read: ElementRef }) originElement!: ElementRef;
  @ViewChild(CdkConnectedOverlay, { static: true }) cdkConnectedOverlay!: CdkConnectedOverlay;
  @ViewChild(TriSelectTopControlComponent, { static: true }) selectTopControlComponent!: TriSelectTopControlComponent;
  @ContentChildren(TriOptionComponent, { descendants: true }) listOfNzOptionComponent!: QueryList<TriOptionComponent>;
  @ContentChildren(TriOptionGroupComponent, { descendants: true })
  listOfNzOptionGroupComponent!: QueryList<TriOptionGroupComponent>;
  @ViewChild(TriOptionGroupComponent, { static: true, read: ElementRef }) optionGroupComponentElement!: ElementRef;
  @ViewChild(TriSelectTopControlComponent, { static: true, read: ElementRef })
  selectTopControlComponentElement!: ElementRef;

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private listOfValue$ = new BehaviorSubject<TriSafeAny[]>([]);
  private listOfTemplateItem$ = new BehaviorSubject<TriSelectItemInterface[]>([]);
  private listOfTagAndTemplateItem: TriSelectItemInterface[] = [];
  private searchValue: string = '';
  private isReactiveDriven = false;
  private value: TriSafeAny | TriSafeAny[];
  private _nzShowArrow: boolean | undefined;
  private requestId: number = -1;
  private isNzDisableFirstChange: boolean = true;

  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  dropdownPosition: TriSelectPlacementType = 'bottomLeft';
  triggerWidth: number | null = null;
  listOfContainerItem: TriSelectItemInterface[] = [];
  listOfTopItem: TriSelectItemInterface[] = [];
  activatedValue: TriSafeAny | null = null;
  listOfValue: TriSafeAny[] = [];
  focused = false;
  dir: Direction = 'ltr';
  positions: ConnectionPositionPair[] = [];

  // status
  prefixCls: string = 'ant-select';
  statusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;

  generateTagItem(value: string): TriSelectItemInterface {
    return {
      nzValue: value,
      nzLabel: value,
      type: 'item'
    };
  }

  onItemClick(value: TriSafeAny): void {
    this.activatedValue = value;
    if (this.mode === 'default') {
      if (this.listOfValue.length === 0 || !this.compareWith(this.listOfValue[0], value)) {
        this.updateListOfValue([value]);
      }
      this.setOpenState(false);
    } else {
      const targetIndex = this.listOfValue.findIndex(o => this.compareWith(o, value));
      if (targetIndex !== -1) {
        const listOfValueAfterRemoved = this.listOfValue.filter((_, i) => i !== targetIndex);
        this.updateListOfValue(listOfValueAfterRemoved);
      } else if (this.listOfValue.length < this.maxMultipleCount) {
        const listOfValueAfterAdded = [...this.listOfValue, value];
        this.updateListOfValue(listOfValueAfterAdded);
      }
      this._focus();
      if (this.autoClearSearchValue) {
        this.clearInput();
      }
    }
  }

  onItemDelete(item: TriSelectItemInterface): void {
    const listOfSelectedValue = this.listOfValue.filter(v => !this.compareWith(v, item.nzValue));
    this.updateListOfValue(listOfSelectedValue);
    this.clearInput();
  }

  updateListOfContainerItem(): void {
    let listOfContainerItem = this.listOfTagAndTemplateItem
      .filter(item => !item.nzHide)
      .filter(item => {
        if (!this.serverSearch && this.searchValue) {
          return this.filterOption(this.searchValue, item);
        } else {
          return true;
        }
      });
    if (this.mode === 'tags' && this.searchValue) {
      const matchedItem = this.listOfTagAndTemplateItem.find(item => item.nzLabel === this.searchValue);
      if (!matchedItem) {
        const tagItem = this.generateTagItem(this.searchValue);
        listOfContainerItem = [tagItem, ...listOfContainerItem];
        this.activatedValue = tagItem.nzValue;
      } else {
        this.activatedValue = matchedItem.nzValue;
      }
    }
    const activatedItem =
      listOfContainerItem.find(item => item.nzLabel === this.searchValue) ||
      listOfContainerItem.find(item => this.compareWith(item.nzValue, this.activatedValue)) ||
      listOfContainerItem.find(item => this.compareWith(item.nzValue, this.listOfValue[0])) ||
      listOfContainerItem[0];
    this.activatedValue = (activatedItem && activatedItem.nzValue) || null;
    let listOfGroupLabel: Array<string | number | TemplateRef<TriSafeAny> | null> = [];
    if (this.isReactiveDriven) {
      listOfGroupLabel = [...new Set(this.options.filter(o => o.groupLabel).map(o => o.groupLabel!))];
    } else {
      if (this.listOfNzOptionGroupComponent) {
        listOfGroupLabel = this.listOfNzOptionGroupComponent.map(o => o.label);
      }
    }
    /** insert group item **/
    listOfGroupLabel.forEach(label => {
      const index = listOfContainerItem.findIndex(item => label === item.groupLabel);
      if (index > -1) {
        const groupItem = { groupLabel: label, type: 'group', key: label } as TriSelectItemInterface;
        listOfContainerItem.splice(index, 0, groupItem);
      }
    });
    this.listOfContainerItem = [...listOfContainerItem];
    this.updateCdkConnectedOverlayPositions();
  }

  clearInput(): void {
    this.selectTopControlComponent.clearInputValue();
  }

  updateListOfValue(listOfValue: TriSafeAny[]): void {
    const covertListToModel = (list: TriSafeAny[], mode: TriSelectModeType): TriSafeAny[] | TriSafeAny => {
      if (mode === 'default') {
        if (list.length > 0) {
          return list[0];
        } else {
          return null;
        }
      } else {
        return list;
      }
    };
    const model = covertListToModel(listOfValue, this.mode);
    if (this.value !== model) {
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.value = model;
      this.onChange(this.value);
    }
  }

  onTokenSeparate(listOfLabel: string[]): void {
    const listOfMatchedValue = this.listOfTagAndTemplateItem
      .filter(item => listOfLabel.findIndex(label => label === item.nzLabel) !== -1)
      .map(item => item.nzValue)
      .filter(item => this.listOfValue.findIndex(v => this.compareWith(v, item)) === -1);
    /**
     * Limit the number of selected items to nzMaxMultipleCount
     */
    const limitWithinMaxCount = <T>(value: T[]): T[] =>
      this.isMaxMultipleCountSet ? value.slice(0, this.maxMultipleCount) : value;

    if (this.mode === 'multiple') {
      const updateValue = limitWithinMaxCount([...this.listOfValue, ...listOfMatchedValue]);
      this.updateListOfValue(updateValue);
    } else if (this.mode === 'tags') {
      const listOfUnMatchedLabel = listOfLabel.filter(
        label => this.listOfTagAndTemplateItem.findIndex(item => item.nzLabel === label) === -1
      );
      const updateValue = limitWithinMaxCount([...this.listOfValue, ...listOfMatchedValue, ...listOfUnMatchedLabel]);
      this.updateListOfValue(updateValue);
    }
    this.clearInput();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const listOfFilteredOptionNotDisabled = this.listOfContainerItem
      .filter(item => item.type === 'item')
      .filter(item => !item.nzDisabled);
    const activatedIndex = listOfFilteredOptionNotDisabled.findIndex(item =>
      this.compareWith(item.nzValue, this.activatedValue)
    );
    switch (e.keyCode) {
      case UP_ARROW:
        e.preventDefault();
        if (this.open && listOfFilteredOptionNotDisabled.length > 0) {
          const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionNotDisabled.length - 1;
          this.activatedValue = listOfFilteredOptionNotDisabled[preIndex].nzValue;
        }
        break;
      case DOWN_ARROW:
        e.preventDefault();
        if (this.open && listOfFilteredOptionNotDisabled.length > 0) {
          const nextIndex = activatedIndex < listOfFilteredOptionNotDisabled.length - 1 ? activatedIndex + 1 : 0;
          this.activatedValue = listOfFilteredOptionNotDisabled[nextIndex].nzValue;
        } else {
          this.setOpenState(true);
        }
        break;
      case ENTER:
        e.preventDefault();
        if (this.open) {
          if (isNotNil(this.activatedValue) && activatedIndex !== -1) {
            this.onItemClick(this.activatedValue);
          }
        } else {
          this.setOpenState(true);
        }
        break;
      case SPACE:
        if (!this.open) {
          this.setOpenState(true);
          e.preventDefault();
        }
        break;
      case TAB:
        if (this.selectOnTab) {
          if (this.open) {
            e.preventDefault();
            if (isNotNil(this.activatedValue)) {
              this.onItemClick(this.activatedValue);
            }
          }
        } else {
          this.setOpenState(false);
        }
        break;
      case ESCAPE:
        /**
         * Skip the ESCAPE processing, it will be handled in {@link onOverlayKeyDown}.
         */
        break;
      default:
        if (!this.open) {
          this.setOpenState(true);
        }
    }
  }

  setOpenState(value: boolean): void {
    if (this.open !== value) {
      this.open = value;
      this.openChange.emit(value);
      this.onOpenChange();
      this.cdr.markForCheck();
    }
  }

  onOpenChange(): void {
    this.updateCdkConnectedOverlayStatus();
    if (this.autoClearSearchValue) {
      this.clearInput();
    }
  }

  onInputValueChange(value: string): void {
    this.searchValue = value;
    this.updateListOfContainerItem();
    this.onSearch.emit(value);
    this.updateCdkConnectedOverlayPositions();
  }

  onClearSelection(): void {
    this.updateListOfValue([]);
    this.onClear.emit();
  }

  onClickOutside(event: MouseEvent): void {
    const target = _getEventTarget(event);
    if (!this.host.nativeElement.contains(target as Node)) {
      this.setOpenState(false);
    }
  }

  _focus(): void {
    this.selectTopControlComponent.focus();
  }

  _blur(): void {
    this.selectTopControlComponent.blur();
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    const placement = getPlacementName(position);
    this.dropdownPosition = placement as TriSelectPlacementType;
  }

  updateCdkConnectedOverlayStatus(): void {
    if (this.platform.isBrowser && this.originElement.nativeElement) {
      const triggerWidth = this.triggerWidth;
      cancelAnimationFrame(this.requestId);
      this.requestId = requestAnimationFrame(() => {
        // Blink triggers style and layout pipelines anytime the `getBoundingClientRect()` is called, which may cause a
        // frame drop. That's why it's scheduled through the `requestAnimationFrame` to unload the composite thread.
        this.triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
        if (triggerWidth !== this.triggerWidth) {
          // The `requestAnimationFrame` will trigger change detection, but we're inside an `OnPush` component which won't have
          // the `ChecksEnabled` state. Calling `markForCheck()` will allow Angular to run the change detection from the root component
          // down to the `nz-select`. But we'll trigger only local change detection if the `triggerWidth` has been changed.
          this.cdr.detectChanges();
        }
      });
    }
  }

  updateCdkConnectedOverlayPositions(): void {
    requestAnimationFrame(() => {
      this.cdkConnectedOverlay?.overlayRef?.updatePosition();
    });
  }

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  protected formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  constructor() {
    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.requestId);
      this.focusMonitor.stopMonitoring(this.host);
    });

    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => {
      this.#size.set(this.size);
      this.cdr.markForCheck();
    });
  }

  writeValue(modelValue: TriSafeAny | TriSafeAny[]): void {
    /** https://github.com/angular/angular/issues/14988 **/
    if (this.value !== modelValue) {
      this.value = modelValue;
      const covertModelToList = (model: TriSafeAny[] | TriSafeAny, mode: TriSelectModeType): TriSafeAny[] => {
        if (model === null || model === undefined) {
          return [];
        } else if (mode === 'default') {
          return [model];
        } else {
          return model;
        }
      };
      const listOfValue = covertModelToList(modelValue, this.mode);
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.cdr.markForCheck();
    }
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
    if (this.disabled) {
      this.setOpenState(false);
    }
    this.cdr.markForCheck();
  }

  ngOnChanges({ nzOpen, nzDisabled, nzOptions, nzStatus, nzPlacement, nzSize }: SimpleChanges): void {
    if (nzOpen) {
      this.onOpenChange();
    }
    if (nzDisabled && this.disabled) {
      this.setOpenState(false);
    }
    if (nzOptions) {
      this.isReactiveDriven = true;
      const listOfOptions = this.options || [];
      const listOfTransformedItem = listOfOptions.map(item => {
        return {
          template: item.label instanceof TemplateRef ? item.label : null,
          nzTitle: this.getTitle(item.title, item.label),
          nzLabel: typeof item.label === 'string' || typeof item.label === 'number' ? item.label : null,
          nzValue: item.value,
          nzDisabled: item.disabled || false,
          nzHide: item.hide || false,
          nzCustomContent: item.label instanceof TemplateRef,
          groupLabel: item.groupLabel || null,
          type: 'item',
          key: item.key === undefined ? item.value : item.key
        };
      });
      this.listOfTemplateItem$.next(listOfTransformedItem);
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
    if (nzPlacement) {
      const { currentValue } = nzPlacement;
      this.dropdownPosition = currentValue as TriSelectPlacementType;
      const listOfPlacement = ['bottomLeft', 'topLeft', 'bottomRight', 'topRight'];
      if (currentValue && listOfPlacement.includes(currentValue)) {
        this.positions = [POSITION_MAP[currentValue as POSITION_TYPE]];
      } else {
        this.positions = listOfPlacement.map(e => POSITION_MAP[e as POSITION_TYPE]);
      }
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        withLatestFrom(this.formNoStatusService ? this.formNoStatusService.noFormStatus : observableOf(false)),
        map(([{ status, hasFeedback }, noStatus]) => ({ status: noStatus ? '' : status, hasFeedback })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.focusMonitor
      .monitor(this.host, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          this.focused = false;
          this.cdr.markForCheck();
          this.blur.emit();
          Promise.resolve().then(() => {
            this.onTouched();
          });
        } else {
          this.focused = true;
          this.cdr.markForCheck();
          this.focus.emit();
        }
      });
    combineLatest([this.listOfValue$, this.listOfTemplateItem$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
        const listOfTagItem = listOfSelectedValue
          .filter(() => this.mode === 'tags')
          .filter(value => listOfTemplateItem.findIndex(o => this.compareWith(o.nzValue, value)) === -1)
          .map(
            value => this.listOfTopItem.find(o => this.compareWith(o.nzValue, value)) || this.generateTagItem(value)
          );
        this.listOfTagAndTemplateItem = [...listOfTemplateItem, ...listOfTagItem];
        this.listOfTopItem = this.listOfValue
          .map(
            v =>
              [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find(item => this.compareWith(v, item.nzValue))!
          )
          .filter(item => !!item);
        this.updateListOfContainerItem();
      });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;

    fromEventOutsideAngular(this.host.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if ((this.open && this.showSearch) || this.disabled) {
          return;
        }

        this.ngZone.run(() => this.setOpenState(!this.open));
      });

    // Caretaker note: we could've added this listener within the template `(overlayKeydown)="..."`,
    // but with this approach, it'll run change detection on each keyboard click, and also it'll run
    // `markForCheck()` internally, which means the whole component tree (starting from the root and
    // going down to the select component) will be re-checked and updated (if needed).
    // This is safe to do that manually since `setOpenState()` calls `markForCheck()` if needed.
    this.cdkConnectedOverlay.overlayKeydown.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(event => {
      if (event.keyCode === ESCAPE) {
        this.setOpenState(false);
      }
    });
  }

  ngAfterContentInit(): void {
    if (!this.isReactiveDriven) {
      merge(this.listOfNzOptionGroupComponent.changes, this.listOfNzOptionComponent.changes)
        .pipe(
          startWith(true),
          switchMap(() =>
            merge(
              ...[
                this.listOfNzOptionComponent.changes,
                this.listOfNzOptionGroupComponent.changes,
                ...this.listOfNzOptionComponent.map(option => option.changes),
                ...this.listOfNzOptionGroupComponent.map(option => option.changes)
              ]
            ).pipe(startWith(true))
          ),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => {
          const listOfOptionInterface = this.listOfNzOptionComponent.toArray().map(item => {
            const { template, label, value, key, disabled, hide, customContent, groupLabel } = item;
            return {
              template,
              nzLabel,
              nzValue,
              nzDisabled,
              nzHide,
              nzCustomContent,
              groupLabel,
              nzTitle: this.getTitle(item.title, item.label),
              type: 'item',
              key: key === undefined ? value : key
            };
          });
          this.listOfTemplateItem$.next(listOfOptionInterface);
          this.cdr.markForCheck();
        });
    }
  }

  private setStatusStyles(status: TriValidateStatus, hasFeedback: boolean): void {
    this._status = status;
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
    // render status if nzStatus is set
    this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
    Object.keys(this.statusCls).forEach(status => {
      if (this.statusCls[status]) {
        this.renderer.addClass(this.host.nativeElement, status);
      } else {
        this.renderer.removeClass(this.host.nativeElement, status);
      }
    });
  }

  private getTitle(title: TriSelectOptionInterface['title'], label: TriSelectOptionInterface['label']): string {
    let rawTitle: string = undefined!;
    if (title === undefined) {
      if (typeof label === 'string' || typeof label === 'number') {
        rawTitle = label.toString();
      }
    } else if (typeof title === 'string' || typeof title === 'number') {
      rawTitle = title.toString();
    }

    return rawTitle;
  }
}
