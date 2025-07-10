/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  OverlayModule
} from '@angular/cdk/overlay';
import { _getEventTarget } from '@angular/cdk/platform';
import { SlicePipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  Input,
  NgZone,
  numberAttribute,
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
import { BehaviorSubject, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, withLatestFrom } from 'rxjs/operators';

import { slideMotion } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import {
  DEFAULT_CASCADER_POSITIONS,
  getPlacementName,
  TriOverlayModule,
  POSITION_MAP,
  POSITION_TYPE
} from 'ng-zorro-antd/core/overlay';
import { TriTreeBase, TriTreeNode } from 'ng-zorro-antd/core/tree';
import {
  NgClassInterface,
  NgStyleInterface,
  TriSafeAny,
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  TriVariant
} from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular, getStatusClassNames, isNotNil, toArray } from 'ng-zorro-antd/core/util';
import { TriEmptyModule } from 'ng-zorro-antd/empty';
import { TriCascaderI18nInterface, TriI18nService } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import {
  TriSelectClearComponent,
  TriSelectItemComponent,
  TriSelectPlaceholderComponent,
  TriSelectPlacementType,
  TriSelectSearchComponent
} from 'ng-zorro-antd/select';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';

import { TriCascaderOptionComponent } from './cascader-option.component';
import { TriCascaderTreeService } from './cascader-tree.service';
import { TriCascaderService } from './cascader.service';
import {
  TriCascaderComponentAsSource,
  TriCascaderExpandTrigger,
  TriCascaderOption,
  TriCascaderPlacement,
  TriCascaderSize,
  TriCascaderTriggerType,
  TriShowSearchOptions
} from './typings';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'cascader';
const defaultDisplayRender = (labels: string[]): string => labels.join(' / ');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '',
  exportAs: 'triCascader',
  template: `
    @if (showInput) {
      <div #selectContainer class="tri-select-selector">
        @if (multiple) {
          @for (node of selectedNodes | slice: 0 : maxTagCount; track node) {
            <tri-select-item
              deletable
              [disabled]="disabled"
              [label]="displayWith(getAncestorOptionList(node))"
              (delete)="removeSelected(node)"
            ></tri-select-item>
          }
          @if (selectedNodes.length > maxTagCount) {
            <tri-select-item [label]="'+ ' + (selectedNodes.length - maxTagCount) + ' ...'"></tri-select-item>
          }
        }

        <tri-select-search
          [showInput]="!!showSearch"
          (isComposingChange)="isComposingChange($event)"
          [value]="inputValue"
          (valueChange)="inputValue = $event"
          [mirrorSync]="multiple"
          [disabled]="disabled"
          [autofocus]="autoFocus"
          [focusTrigger]="menuVisible"
        ></tri-select-search>

        @if (showPlaceholder) {
          <tri-select-placeholder
            [placeholder]="placeHolder || locale?.placeholder!"
            [style.display]="inputValue || isComposing ? 'none' : 'block'"
          ></tri-select-placeholder>
        }

        @if (showLabelRender) {
          <tri-select-item
            [disabled]="disabled"
            [label]="labelRenderText"
            [contentTemplateOutlet]="isLabelRenderTemplate ? labelRender : null"
            [contentTemplateOutletContext]="labelRenderContext"
          ></tri-select-item>
        }
      </div>

      @if (showArrow) {
        <span class="tri-select-arrow" [class.tri-select-arrow-loading]="isLoading">
          @if (!isLoading) {
            <tri-icon [type]="$any(suffixIcon)" [class.tri-cascader-picker-arrow-expand]="menuVisible" />
          } @else {
            <tri-icon type="loading" />
          }

          @if (hasFeedback && !!status) {
            <tri-form-item-feedback-icon [status]="status" />
          }
        </span>
      }
      @if (clearIconVisible) {
        <tri-select-clear (clear)="clearSelection($event)"></tri-select-clear>
      }
    }
    <ng-content></ng-content>

    <ng-template
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="backdrop"
      [cdkConnectedOverlayOrigin]="overlayOrigin"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-cascader-dropdown'"
      [cdkConnectedOverlayOpen]="menuVisible"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="closeMenu()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="tri-select-dropdown tri-cascader-dropdown"
        [class.tri-select-dropdown-placement-bottomLeft]="dropdownPosition === 'bottomLeft'"
        [class.tri-select-dropdown-placement-bottomRight]="dropdownPosition === 'bottomRight'"
        [class.tri-select-dropdown-placement-topLeft]="dropdownPosition === 'topLeft'"
        [class.tri-select-dropdown-placement-topRight]="dropdownPosition === 'topRight'"
        [class.tri-cascader-dropdown-rtl]="dir === 'rtl'"
        [@slideMotion]="'enter'"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [noAnimation]="noAnimation?.nzNoAnimation"
        (mouseenter)="onTriggerMouseEnter()"
        (mouseleave)="onTriggerMouseLeave($event)"
      >
        <div
          #menu
          class="tri-cascader-menus"
          [class.tri-cascader-rtl]="dir === 'rtl'"
          [class.tri-cascader-menus-hidden]="!menuVisible"
          [class.tri-cascader-menu-empty]="shouldShowEmpty"
          [class]="menuClassName"
          [style]="menuStyle"
        >
          @if (shouldShowEmpty) {
            <ul class="tri-cascader-menu" [style.width]="dropdownWidthStyle" [style.height]="dropdownHeightStyle">
              <li class="tri-cascader-menu-item tri-cascader-menu-item-disabled">
                <tri-embed-empty
                  class="tri-cascader-menu-item-content"
                  [componentName]="'cascader'"
                  [specificContent]="notFoundContent"
                />
              </li>
            </ul>
          } @else {
            @for (options of cascaderService.columns; track options; let i = $index) {
              <ul
                class="tri-cascader-menu"
                role="menuitemcheckbox"
                [class]="columnClassName"
                [style.height]="dropdownHeightStyle"
              >
                @for (option of options; track option) {
                  <li
                    tri-cascader-option
                    [expandIcon]="expandIcon"
                    [columnIndex]="i"
                    [labelProperty]="labelProperty"
                    [optionTemplate]="optionRender"
                    [activated]="isOptionActivated(option, i)"
                    [highlightText]="inSearchingMode ? inputValue : ''"
                    [node]="option"
                    [dir]="dir"
                    [checkable]="multiple"
                    (mouseenter)="onOptionMouseEnter(option, i, $event)"
                    (mouseleave)="onOptionMouseLeave(option, i, $event)"
                    (click)="onOptionClick(option, i, $event)"
                    (check)="onOptionCheck(option, i)"
                  ></li>
                }
              </ul>
            }
          }
        </div>
      </div>
    </ng-template>
  `,
  animations: [slideMotion],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriCascaderComponent),
      multi: true
    },
    { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'select' },
    TriCascaderService,
    TriCascaderTreeService
  ],
  host: {
    '[attr.tabIndex]': '"0"',
    '[class.tri-select-in-form-item]': '!!formStatusService',
    '[class.tri-select-lg]': 'finalSize() === "large"',
    '[class.tri-select-sm]': 'finalSize() === "small"',
    '[class.tri-select-allow-clear]': 'allowClear',
    '[class.tri-select-show-arrow]': 'showArrow',
    '[class.tri-select-show-search]': '!!showSearch',
    '[class.tri-select-disabled]': 'disabled',
    '[class.tri-select-borderless]': `variant === 'borderless'`,
    '[class.tri-select-filled]': `variant === 'filled'`,
    '[class.tri-select-underlined]': `variant === 'underlined'`,
    '[class.tri-select-open]': 'menuVisible',
    '[class.tri-select-focused]': 'isFocused',
    '[class.tri-select-multiple]': 'multiple',
    '[class.tri-select-single]': '!multiple',
    '[class.tri-select-rtl]': `dir === 'rtl'`
  },
  hostDirectives: [TriSpaceCompactItemDirective],
  imports: [
    SlicePipe,
    OverlayModule,
    FormsModule,
    TriIconModule,
    TriEmptyModule,
    TriFormItemFeedbackIconComponent,
    TriOverlayModule,
    TriNoAnimationDirective,
    TriSelectClearComponent,
    TriSelectItemComponent,
    TriSelectPlaceholderComponent,
    TriSelectSearchComponent,
    TriCascaderOptionComponent
  ]
})
export class TriCascaderComponent
  extends TriTreeBase
  implements TriCascaderComponentAsSource, OnInit, OnChanges, ControlValueAccessor
{
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private i18nService = inject(TriI18nService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @ViewChild('selectContainer', { static: false }) selectContainer!: ElementRef;

  @ViewChild(TriSelectSearchComponent)
  set input(inputComponent: TriSelectSearchComponent | undefined) {
    this.input$.next(inputComponent?.inputElement);
  }

  get input(): ElementRef<HTMLInputElement> | undefined {
    return this.input$.getValue();
  }

  /** Used to store the native `<input type="search" />` element since it might be set asynchronously. */
  private input$ = new BehaviorSubject<ElementRef<HTMLInputElement> | undefined>(undefined);

  @ViewChild('menu', { static: false }) menu!: ElementRef;
  @ViewChild(CdkConnectedOverlay, { static: false }) overlay!: CdkConnectedOverlay;
  @ViewChildren(TriCascaderOptionComponent) cascaderItems!: QueryList<TriCascaderOptionComponent>;

  @Input() optionRender: TemplateRef<{ $implicit: TriCascaderOption; index: number }> | null = null;
  @Input({ transform: booleanAttribute }) showInput = true;
  @Input({ transform: booleanAttribute }) showArrow = true;
  @Input({ transform: booleanAttribute }) allowClear = true;
  @Input({ transform: booleanAttribute }) autoFocus = false;
  @Input({ transform: booleanAttribute }) changeOnSelect = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() columnClassName?: string;
  @Input() expandTrigger: TriCascaderExpandTrigger = 'click';
  @Input() valueProperty: string = 'value';
  @Input() labelProperty: string = 'label';
  @Input() labelRender: TemplateRef<typeof this.labelRenderContext> | null = null;
  @Input() @WithConfig() variant: TriVariant = 'outlined';
  @Input() notFoundContent?: string | TemplateRef<void>;
  @Input() @WithConfig() size: TriCascaderSize = 'default';
  @Input() @WithConfig() backdrop = false;
  @Input() showSearch: boolean | TriShowSearchOptions = false;
  @Input() placeHolder: string = '';
  @Input() menuClassName?: string;
  @Input() menuStyle: NgStyleInterface | null = null;
  /**
   * Duration in milliseconds before opening the menu when the mouse enters the trigger.
   * @default 150
   */
  @Input({ transform: numberAttribute }) mouseLeaveDelay: number = 150;
  /**
   * Duration in milliseconds before closing the menu when the mouse leaves the trigger.
   * @default 150
   */
  @Input({ transform: numberAttribute }) mouseEnterDelay: number = 150;
  @Input() status: TriStatus = '';
  @Input({ transform: booleanAttribute }) multiple: boolean = false;
  @Input() maxTagCount: number = Infinity;
  @Input() placement: TriCascaderPlacement = 'bottomLeft';

  @Input() triggerAction: TriCascaderTriggerType | TriCascaderTriggerType[] = ['click'] as TriCascaderTriggerType[];
  @Input() changeOn?: (option: TriCascaderOption, level: number) => boolean;
  @Input() loadData?: (node: TriCascaderOption, index: number) => PromiseLike<TriSafeAny> | Observable<TriSafeAny>;
  @Input() displayWith: (nodes: TriCascaderOption[]) => string | undefined = (nodes: TriCascaderOption[]) => {
    return defaultDisplayRender(nodes.map(n => this.cascaderService.getOptionLabel(n!)));
  };
  // TODO: RTL
  @Input() suffixIcon: string | TemplateRef<void> = 'down';
  @Input() expandIcon: string | TemplateRef<void> = '';

  @Input()
  get options(): TriCascaderOption[] | null {
    return this.cascaderService.options;
  }

  set options(options: TriCascaderOption[] | null) {
    const nodes = this.coerceTreeNodes(options || []);
    this.treeService.initTree(nodes);
    this.cascaderService.columns = [nodes];
    this.updateSelectedNodes(true);

    if (this.inSearchingMode) {
      this.cascaderService.setSearchingMode(this.inSearchingMode);
      this.cascaderService.prepareSearchOptions(this.inputValue);
    }
  }

  get treeService(): TriCascaderTreeService {
    return this.nzTreeService as TriCascaderTreeService;
  }

  @Output() readonly visibleChange = new EventEmitter<boolean>();
  @Output() readonly selectionChange = new EventEmitter<TriCascaderOption[]>();
  @Output() readonly removed = new EventEmitter<TriCascaderOption>();
  @Output() readonly clear = new EventEmitter<void>();

  prefixCls: string = 'ant-select';
  statusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;

  /**
   * If the dropdown should show the empty content.
   * `true` if there's no options.
   */
  shouldShowEmpty: boolean = false;

  el: HTMLElement = this.elementRef.nativeElement;
  menuVisible = false;
  isLoading = false;
  labelRenderText?: string;
  labelRenderContext = {};
  onChange = Function.prototype;
  onTouched = Function.prototype;
  positions: ConnectionPositionPair[] = [...DEFAULT_CASCADER_POSITIONS];

  /**
   * Dropdown width in pixel.
   */
  dropdownWidthStyle?: string;
  dropdownHeightStyle: 'auto' | '' = '';
  dropdownPosition: TriCascaderPlacement = 'bottomLeft';
  isFocused = false;

  locale!: TriCascaderI18nInterface;
  dir: Direction = 'ltr';

  isComposing = false;

  protected get overlayOrigin(): ElementRef {
    return this.elementRef;
  }

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private inputString = '';
  private isOpening = false;
  private delayMenuTimer?: ReturnType<typeof setTimeout>;
  private delaySelectTimer?: ReturnType<typeof setTimeout>;
  private isNzDisableFirstChange: boolean = true;
  selectedNodes: TriTreeNode[] = [];

  get inSearchingMode(): boolean {
    return this.cascaderService.inSearchingMode;
  }

  set inputValue(inputValue: string) {
    this.inputString = inputValue;
    this.toggleSearchingMode(!!inputValue);
  }

  get inputValue(): string {
    return this.inputString;
  }

  private get hasInput(): boolean {
    return !!this.inputValue;
  }

  private get hasValue(): boolean {
    return this.cascaderService.values && this.cascaderService.values.length > 0;
  }

  get showLabelRender(): boolean {
    return !this.hasInput && !this.multiple && !!this.selectedNodes.length;
  }

  get showPlaceholder(): boolean {
    return !(this.hasInput || this.hasValue);
  }

  get clearIconVisible(): boolean {
    return this.allowClear && !this.disabled && (this.hasValue || this.hasInput);
  }

  get isLabelRenderTemplate(): boolean {
    return !!this.labelRender;
  }

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });
  public cascaderService = inject(TriCascaderService);

  constructor() {
    super(inject(TriCascaderTreeService));
    this.cascaderService.withComponent(this);
    this.renderer.addClass(this.elementRef.nativeElement, 'ant-select');
    this.renderer.addClass(this.elementRef.nativeElement, 'ant-cascader');

    this.destroyRef.onDestroy(() => {
      this.clearDelayMenuTimer();
      this.clearDelaySelectTimer();
    });

    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => {
      this.#size.set(this.size);
      this.cdr.markForCheck();
    });
  }

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

    const srv = this.cascaderService;

    srv.$redraw.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // These operations would not mutate data.
      this.checkChildren();
      this.setDisplayLabel();
      this.cdr.detectChanges();
      this.reposition();
      this.setDropdownStyles();
    });

    srv.$loading.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(loading => {
      this.isLoading = loading;
    });

    srv.$nodeSelected.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(node => {
      if (!node) {
        this.emitValue([]);
        this.selectionChange.emit([]);
      } else {
        const shouldClose =
          // keep menu opened if multiple mode
          !this.multiple && (node.isLeaf || (this.changeOnSelect && this.expandTrigger === 'hover'));
        if (shouldClose) {
          this.delaySetMenuVisible(false);
        }
        this.selectionChange.emit(this.getAncestorOptionList(node));
        this.cdr.markForCheck();
      }
    });

    srv.$quitSearching.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.inputValue = '';
      this.dropdownWidthStyle = '';
    });

    this.i18nService.localeChange.pipe(startWith(), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.setLocale();
    });

    this.#size.set(this.size);

    this.dir = this.directionality.value;
    this.directionality.change.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.dir = this.directionality.value;
      srv.$redraw.next();
    });

    this.setupSelectionChangeListener();
    this.setupChangeListener();
    this.setupKeydownListener();
    this.setupFocusListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzStatus, nzSize, nzPlacement } = changes;
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
    if (nzPlacement) {
      const { currentValue } = nzPlacement;
      this.dropdownPosition = currentValue as TriCascaderPlacement;
      const listOfPlacement = ['bottomLeft', 'topLeft', 'bottomRight', 'topRight'];
      if (currentValue && listOfPlacement.includes(currentValue)) {
        this.positions = [POSITION_MAP[currentValue as POSITION_TYPE]];
      } else {
        this.positions = listOfPlacement.map(e => POSITION_MAP[e as POSITION_TYPE]);
      }
    }
  }

  registerOnChange(fn: () => {}): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  writeValue(value: TriSafeAny): void {
    if (isNotNil(value)) {
      if (this.multiple) {
        this.cascaderService.values = toArray(value);
      } else {
        this.cascaderService.values = [toArray(value)];
      }
      // need clear selected nodes when user set value before updating
      this.clearSelectedNodes();
      this.updateSelectedNodes(true, false);
    } else {
      this.cascaderService.values = [];
      this.clearSelectedNodes();
      this.selectedNodes = [];
      this.cascaderService.$redraw.next();
    }
  }

  private setupSelectionChangeListener(): void {
    merge(this.selectionChange, this.removed, this.clear)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateSelectedNodes();
        this.emitValue(this.cascaderService.values);
        this.cascaderService.$redraw.next();
      });
  }

  delaySetMenuVisible(visible: boolean, delay: number = 100, setOpening: boolean = false): void {
    this.clearDelayMenuTimer();
    if (delay) {
      if (visible && setOpening) {
        this.isOpening = true;
      }
      this.delayMenuTimer = setTimeout(() => {
        this.setMenuVisible(visible);
        this.cdr.detectChanges();
        this.clearDelayMenuTimer();
        if (visible) {
          setTimeout(() => {
            this.isOpening = false;
          }, 100);
        }
      }, delay);
    } else {
      this.setMenuVisible(visible);
    }
  }

  setMenuVisible(visible: boolean): void {
    if (this.disabled || this.menuVisible === visible) {
      return;
    }
    if (visible) {
      this.cascaderService.$redraw.next();
      this.updateSelectedNodes(!!this.loadData);
      this.scrollToActivatedOptions();
    } else {
      this.inputValue = '';
    }

    this.menuVisible = visible;
    this.visibleChange.emit(visible);
    this.cdr.detectChanges();
  }

  private clearDelayMenuTimer(): void {
    if (this.delayMenuTimer) {
      clearTimeout(this.delayMenuTimer);
      this.delayMenuTimer = undefined;
    }
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.clearSelectedNodes();
    this.labelRenderText = '';
    this.labelRenderContext = {};
    this.inputValue = '';
    this.setMenuVisible(false);
    this.cascaderService.clear();
    this.clear.emit();
  }

  clearSelectedNodes(): void {
    this.selectedNodes.forEach(node => {
      this.removeSelected(node, false);
    });
  }

  emitValue(values: TriSafeAny[] | null): void {
    if (this.multiple) {
      this.onChange(values);
    } else {
      this.onChange(values?.length ? values[0] : []);
    }
  }

  /**
   * @internal
   */
  getSubmitValue(): TriSafeAny[] {
    if (this.multiple) {
      return this.cascaderService.values;
    } else {
      return this.cascaderService.values?.length ? this.cascaderService.values[0] : [];
    }
  }

  focus(): void {
    if (!this.isFocused) {
      (this.input?.nativeElement || this.el).focus();
      this.isFocused = true;
    }
  }

  blur(): void {
    if (this.isFocused) {
      (this.input?.nativeElement || this.el).blur();
      this.isFocused = false;
    }
  }

  handleInputBlur(): void {
    this.menuVisible ? this.focus() : this.blur();
  }

  handleInputFocus(): void {
    this.focus();
  }

  isComposingChange(isComposing: boolean): void {
    this.isComposing = isComposing;
  }

  @HostListener('click')
  onTriggerClick(): void {
    if (this.disabled) {
      return;
    }
    if (this.showSearch) {
      this.focus();
    }
    if (this.isActionTrigger('click')) {
      this.delaySetMenuVisible(!this.menuVisible, 100);
    }
    this.onTouched();
  }

  @HostListener('mouseenter')
  onTriggerMouseEnter(): void {
    if (this.disabled || !this.isActionTrigger('hover')) {
      return;
    }

    this.delaySetMenuVisible(true, this.mouseEnterDelay, true);
  }

  @HostListener('mouseleave', ['$event'])
  onTriggerMouseLeave(event: MouseEvent): void {
    if (this.disabled || !this.menuVisible || this.isOpening || !this.isActionTrigger('hover')) {
      event.preventDefault();
      return;
    }
    const mouseTarget = event.relatedTarget as HTMLElement;
    const hostEl = this.el;
    const menuEl = this.menu && (this.menu.nativeElement as HTMLElement);
    if (hostEl.contains(mouseTarget) || (menuEl && menuEl.contains(mouseTarget))) {
      return;
    }
    this.delaySetMenuVisible(false, this.mouseLeaveDelay);
  }

  onOptionMouseEnter(node: TriTreeNode, columnIndex: number, event: Event): void {
    event.preventDefault();
    if (this.expandTrigger === 'hover') {
      if (!node.isLeaf) {
        this.delaySetOptionActivated(node, columnIndex, false);
      } else {
        this.cascaderService.setNodeDeactivatedSinceColumn(columnIndex);
      }
    }
  }

  onOptionMouseLeave(node: TriTreeNode, _columnIndex: number, event: Event): void {
    event.preventDefault();
    if (this.expandTrigger === 'hover' && !node.isLeaf) {
      this.clearDelaySelectTimer();
    }
  }

  /**
   * Get ancestor options of a node
   */
  protected getAncestorOptionList(node: TriTreeNode | null): TriCascaderOption[] {
    const ancestors = this.treeService.getAncestorNodeList(node);
    return this.treeService.toOptions(ancestors);
  }

  updateSelectedNodes(init: boolean = false, updateValue = true): void {
    const value = this.cascaderService.values;
    const multiple = this.multiple;

    /**
     * Update selected nodes and emit value
     * @param shouldUpdateValue if false, only update selected nodes
     */
    const updateNodesAndValue = (shouldUpdateValue: boolean): void => {
      this.selectedNodes = [...(this.multiple ? this.getCheckedNodeList() : this.getSelectedNodeList())].sort(
        (a, b) => {
          const indexA = value.indexOf(a.key);
          const indexB = value.indexOf(b.key);
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          if (indexA !== -1) {
            return -1;
          }
          if (indexB !== -1) {
            return 1;
          }
          return 0;
        }
      );
      if (shouldUpdateValue) {
        this.cascaderService.values = this.selectedNodes.map(node =>
          this.getAncestorOptionList(node).map(o => this.cascaderService.getOptionValue(o))
        );
      }
      this.cascaderService.$redraw.next();
    };

    if (init) {
      const defaultValue = value[0];
      const lastColumnIndex = defaultValue?.length ? defaultValue.length - 1 : 0;
      this.treeService.fieldNames = {
        value: this.valueProperty,
        label: this.labelProperty
      };
      this.treeService.isMultiple = multiple;
      this.treeService.isCheckStrictly = false;

      /**
       * check whether the node is checked or selected according to the value
       */
      const checkNodeStates = (): void => {
        if (multiple) {
          this.treeService.conductCheckPaths(value, this.treeService.isCheckStrictly);
        } else {
          this.treeService.conductSelectedPaths(value);
        }
      };

      const initColumnWithIndex = (columnIndex = 0): void => {
        const activatedOptionSetter = (): void => {
          const currentValue = defaultValue?.[columnIndex];

          if (!isNotNil(currentValue)) {
            this.cascaderService.$redraw.next();
            return;
          }

          const node =
            this.cascaderService.columns[columnIndex].find(
              n => this.cascaderService.getOptionValue(n.origin) === currentValue
            ) || null;

          if (isNotNil(node)) {
            this.cascaderService.setNodeActivated(node, columnIndex, false, multiple, false);

            // Load next level options till leaf node
            if (columnIndex < lastColumnIndex) {
              initColumnWithIndex(columnIndex + 1);
            }
          }

          checkNodeStates();
          updateNodesAndValue(false);
        };

        if (this.cascaderService.isLoaded(columnIndex) || !this.loadData) {
          activatedOptionSetter();
        } else {
          const node = this.cascaderService.activatedNodes[columnIndex - 1];
          this.cascaderService.loadChildren(node, columnIndex - 1, activatedOptionSetter);
        }
      };

      // if nzLoadData set, load first level data asynchronously
      if (this.loadData) {
        initColumnWithIndex();
      } else {
        const nodes = this.coerceTreeNodes(this.options || []);
        this.treeService.initTree(nodes);
        this.cascaderService.setColumnData(nodes, 0);
        initColumnWithIndex();
      }
    }

    updateNodesAndValue(updateValue);
  }

  onOptionClick(node: TriTreeNode, columnIndex: number, event: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (node && node.isDisabled) {
      return;
    }

    this.el.focus();

    // for multiple mode, click the leaf node can be seen as check action
    if (this.multiple && node.isLeaf) {
      this.onOptionCheck(node, columnIndex, true);
    } else {
      this.inSearchingMode
        ? this.cascaderService.setSearchOptionSelected(node, this.multiple)
        : this.cascaderService.setNodeActivated(node, columnIndex, !this.multiple);
    }
  }

  onOptionCheck(node: TriTreeNode, columnIndex: number, performActivate = false): void {
    if (!this.multiple || node.isDisabled || node.isDisableCheckbox) {
      return;
    }

    node.isChecked = !node.isChecked;
    node.isHalfChecked = false;
    this.treeService.setCheckedNodeList(node);
    this.treeService.conduct(node, this.treeService.isCheckStrictly);

    if (this.inSearchingMode) {
      this.cascaderService.setSearchOptionSelected(node, true);
    } else if (performActivate) {
      this.cascaderService.setNodeActivated(node, columnIndex, true, true);
    } else {
      // only update selected nodes and not set node activated by default
      this.cascaderService.setNodeSelected(node, columnIndex, true);
    }
  }

  removeSelected(node: TriTreeNode, emitEvent = true): void {
    node.isSelected = false;
    node.isChecked = false;
    if (this.multiple) {
      this.treeService.conduct(node, this.treeService.isCheckStrictly);
    }
    this.treeService.setSelectedNodeList(node, this.multiple);
    if (emitEvent) {
      this.removed.emit(node.origin);
    }
  }

  onClickOutside(event: MouseEvent): void {
    const target = _getEventTarget(event);
    if (!this.el.contains(target as Node)) {
      this.closeMenu();
    }
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    const placement = getPlacementName(position);
    this.dropdownPosition = placement as TriSelectPlacementType;
  }

  private isActionTrigger(action: 'click' | 'hover'): boolean {
    return typeof this.triggerAction === 'string'
      ? this.triggerAction === action
      : this.triggerAction.indexOf(action) !== -1;
  }

  private onEnter(): void {
    const columnIndex = Math.max(this.cascaderService.activatedNodes.length - 1, 0);
    const node = this.cascaderService.activatedNodes[columnIndex];
    if (node && !node.isDisabled) {
      this.inSearchingMode
        ? this.cascaderService.setSearchOptionSelected(node)
        : this.cascaderService.setNodeActivated(node, columnIndex, true);
    }
  }

  private moveUpOrDown(isUp: boolean): void {
    const columnIndex = Math.max(this.cascaderService.activatedNodes.length - 1, 0);
    const activatedNode = this.cascaderService.activatedNodes[columnIndex];
    const options = this.cascaderService.columns[columnIndex] || [];
    const length = options.length;
    let nextIndex = -1;
    if (!activatedNode) {
      // Not selected options in this column
      nextIndex = isUp ? length : -1;
    } else {
      nextIndex = options.indexOf(activatedNode);
    }

    while (true) {
      nextIndex = isUp ? nextIndex - 1 : nextIndex + 1;
      if (nextIndex < 0 || nextIndex >= length) {
        break;
      }
      const nextOption = options[nextIndex];
      if (!nextOption || nextOption.isDisabled) {
        continue;
      }
      this.cascaderService.setNodeActivated(nextOption, columnIndex);
      break;
    }
  }

  private moveLeft(): void {
    const options = this.cascaderService.activatedNodes;
    if (options.length) {
      options.pop(); // Remove the last one
      this.cascaderService.setNodeDeactivatedSinceColumn(options.length); // collapse menu
    }
  }

  private moveRight(): void {
    const length = this.cascaderService.activatedNodes.length;
    const options = this.cascaderService.columns[length];
    if (options && options.length) {
      const nextOpt = options.find(o => !o.isDisabled);
      if (nextOpt) {
        this.cascaderService.setNodeActivated(nextOpt, length);
      }
    }
  }

  private clearDelaySelectTimer(): void {
    if (this.delaySelectTimer) {
      clearTimeout(this.delaySelectTimer);
      this.delaySelectTimer = undefined;
    }
  }

  private delaySetOptionActivated(node: TriTreeNode, columnIndex: number, performSelect: boolean): void {
    this.clearDelaySelectTimer();
    this.delaySelectTimer = setTimeout(() => {
      this.cascaderService.setNodeActivated(node, columnIndex, performSelect, this.multiple);
      this.delaySelectTimer = undefined;
    }, 150);
  }

  private toggleSearchingMode(toSearching: boolean): void {
    if (this.inSearchingMode !== toSearching) {
      this.cascaderService.setSearchingMode(toSearching);
    }

    if (this.inSearchingMode) {
      this.cascaderService.prepareSearchOptions(this.inputValue);
    }
  }

  isOptionActivated(node: TriTreeNode, index: number): boolean {
    return this.cascaderService.activatedNodes[index] === node;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.isNzDisableFirstChange = false;
    if (this.disabled) {
      this.closeMenu();
    }
  }

  closeMenu(): void {
    this.blur();
    this.clearDelayMenuTimer();
    this.setMenuVisible(false);
    // if select none, clear previous state
    if (!this.hasValue && this.cascaderService.columns.length) {
      this.cascaderService.dropBehindColumns(0);
    }
  }

  /**
   * Reposition the cascader panel. When a menu opens, the cascader expands
   * and may exceed the boundary of browser's window.
   */
  private reposition(): void {
    if (this.overlay && this.overlay.overlayRef && this.menuVisible) {
      Promise.resolve().then(() => {
        this.overlay.overlayRef.updatePosition();
        this.cdr.markForCheck();
      });
    }
  }

  /**
   * When a cascader options is changed, a child needs to know that it should re-render.
   */
  private checkChildren(): void {
    if (this.cascaderItems) {
      this.cascaderItems.forEach(item => item.markForCheck());
    }
  }

  private setDisplayLabel(): void {
    if (this.multiple) {
      return;
    }

    const node = this.selectedNodes.length ? this.selectedNodes[0] : null;
    const selectedOptions = this.getAncestorOptionList(node);
    const labels: string[] = selectedOptions.map(o => this.cascaderService.getOptionLabel(o));

    if (this.isLabelRenderTemplate) {
      this.labelRenderContext = { labels, selectedOptions };
    }
    this.labelRenderText = defaultDisplayRender.call(this, labels);
  }

  private setDropdownStyles(): void {
    const firstColumn = this.cascaderService.columns[0];

    this.shouldShowEmpty =
      (this.inSearchingMode && (!firstColumn || !firstColumn.length)) || // Should show empty when there's no searching result
      (!(this.options && this.options.length) && !this.loadData); // Should show when there's no options and developer does not use nzLoadData
    this.dropdownHeightStyle = this.shouldShowEmpty ? 'auto' : '';

    if (this.input) {
      this.dropdownWidthStyle =
        this.inSearchingMode || this.shouldShowEmpty ? `${this.selectContainer.nativeElement.offsetWidth}px` : '';
    }
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

  private setLocale(): void {
    this.locale = this.i18nService.getLocaleData('global');
    this.cdr.markForCheck();
  }

  private scrollToActivatedOptions(): void {
    // The `scrollIntoView` is a native DOM API, which doesn't require Angular to run
    // a change detection when a promise microtask is resolved.
    this.ngZone.runOutsideAngular(() => {
      Promise.resolve().then(() => {
        // scroll only until option menu view is ready
        this.cascaderItems
          .toArray()
          .filter(e => e.activated)
          .forEach(e => {
            e.nativeElement.scrollIntoView({ block: 'start', inline: 'nearest' });
          });
      });
    });
  }

  private setupChangeListener(): void {
    this.input$
      .pipe(
        switchMap(input => fromEventOutsideAngular(input?.nativeElement, 'change')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => event.stopPropagation());
  }

  private setupFocusListener(): void {
    this.input$
      .pipe(
        switchMap(input => fromEventOutsideAngular(input?.nativeElement, 'focus')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.handleInputFocus());

    this.input$
      .pipe(
        switchMap(input => fromEventOutsideAngular(input?.nativeElement, 'blur')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.handleInputBlur());
  }

  private setupKeydownListener(): void {
    fromEventOutsideAngular<KeyboardEvent>(this.el, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        const keyCode = event.keyCode;

        if (
          keyCode !== DOWN_ARROW &&
          keyCode !== UP_ARROW &&
          keyCode !== LEFT_ARROW &&
          keyCode !== RIGHT_ARROW &&
          keyCode !== ENTER &&
          keyCode !== BACKSPACE &&
          keyCode !== ESCAPE
        ) {
          return;
        }

        // Press any keys above to reopen menu.
        if (!this.menuVisible && keyCode !== BACKSPACE && keyCode !== ESCAPE) {
          // The `setMenuVisible` runs `detectChanges()`, so we don't need to run `markForCheck()` additionally.
          return this.ngZone.run(() => this.setMenuVisible(true));
        }

        // Make these keys work as default in searching mode.
        if (this.inSearchingMode && (keyCode === BACKSPACE || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
          return;
        }

        if (!this.menuVisible) {
          return;
        }

        event.preventDefault();

        this.ngZone.run(() => {
          // Interact with the component.
          if (keyCode === DOWN_ARROW) {
            this.moveUpOrDown(false);
          } else if (keyCode === UP_ARROW) {
            this.moveUpOrDown(true);
          } else if (keyCode === LEFT_ARROW) {
            this.moveLeft();
          } else if (keyCode === RIGHT_ARROW) {
            this.moveRight();
          } else if (keyCode === ENTER) {
            this.onEnter();
          }
          // `@HostListener`s run `markForCheck()` internally before calling the actual handler so
          // we call `markForCheck()` to be backwards-compatible.
          this.cdr.markForCheck();
        });
      });
  }
}
