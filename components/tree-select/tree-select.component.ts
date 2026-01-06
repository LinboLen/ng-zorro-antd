/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { BACKSPACE, ESCAPE, TAB } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import { _getEventTarget } from '@angular/cdk/platform';
import { SlicePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
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
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  numberAttribute,
  signal,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, combineLatest, merge, of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, tap, withLatestFrom } from 'rxjs/operators';

import { TriNoAnimationDirective, slideAnimationEnter, slideAnimationLeave } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriFormItemFeedbackIconComponent, TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { TriOverlayModule, POSITION_MAP } from 'ng-zorro-antd/core/overlay';
import { requestAnimationFrame } from 'ng-zorro-antd/core/polyfill';
import {
  TriFormatEmitEvent,
  TriTreeBase,
  TriTreeHigherOrderServiceToken,
  TriTreeNode,
  TriTreeNodeOptions
} from 'ng-zorro-antd/core/tree';
import {
  NgClassInterface,
  NgStyleInterface,
  TriSafeAny,
  TriSizeLDSType,
  TriStatus,
  TriValidateStatus,
  TriVariant,
  OnChangeType,
  OnTouchedType
} from 'ng-zorro-antd/core/types';
import { getStatusClassNames, isNotNil } from 'ng-zorro-antd/core/util';
import { TriEmptyModule } from 'ng-zorro-antd/empty';
import { TriSelectModule, TriSelectSearchComponent } from 'ng-zorro-antd/select';
import { TRI_SPACE_COMPACT_ITEM_TYPE, TRI_SPACE_COMPACT_SIZE, TriSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { TriTreeComponent, TriTreeModule } from 'ng-zorro-antd/tree';

import { TriTreeSelectService } from './tree-select.service';

export type TriPlacementType = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight' | '';
const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'treeSelect';
const TREE_SELECT_DEFAULT_CLASS = 'ant-select-dropdown ant-select-tree-dropdown';
const listOfPositions = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topRight,
  POSITION_MAP.topLeft
];

@Component({
  selector: 'tri-tree-select',
  exportAs: 'triTreeSelect',
  imports: [
    TriOverlayModule,
    CdkConnectedOverlay,
    TriNoAnimationDirective,
    TriTreeModule,
    TriEmptyModule,
    CdkOverlayOrigin,
    SlicePipe,
    TriSelectModule,
    TriFormItemFeedbackIconComponent,
    TriStringTemplateOutletDirective
  ],
  template: `
    <ng-template
      cdkConnectedOverlay
      connectedOverlay
      [cdkConnectedOverlayHasBackdrop]="backdrop"
      [cdkConnectedOverlayOrigin]="cdkOverlayOrigin"
      [cdkConnectedOverlayPositions]="placement ? positions : []"
      [cdkConnectedOverlayOpen]="open"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-tree-dropdown'"
      [cdkConnectedOverlayMinWidth]="$any(dropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(dropdownMatchSelectWidth ? triggerWidth : null)"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="closeDropdown()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        [class]="dropdownClassName"
        [noAnimation]="!!noAnimation?.nzNoAnimation?.()"
        [animate.enter]="slideAnimationEnter()"
        [animate.leave]="slideAnimationLeave()"
        [class.tri-select-dropdown-placement-bottomLeft]="dropdownPosition === 'bottom'"
        [class.tri-select-dropdown-placement-topLeft]="dropdownPosition === 'top'"
        [class.tri-tree-select-dropdown-rtl]="dir === 'rtl'"
        [dir]="dir"
        [style]="dropdownStyle"
      >
        <tri-tree
          #treeRef
          [hidden]="isNotFound"
          noAnimation
          selectMode
          blockNode
          [data]="nodes"
          [multiple]="multiple"
          [searchValue]="inputValue"
          [hideUnMatched]="hideUnMatched"
          [showIcon]="showIcon"
          [checkable]="checkable"
          [asyncData]="asyncData"
          [showExpand]="showExpand"
          [showLine]="showLine"
          [expandedIcon]="expandedIcon"
          [expandAll]="defaultExpandAll"
          [expandedKeys]="expandedKeys"
          [checkedKeys]="checkable ? value : []"
          [selectedKeys]="!checkable ? value : []"
          [treeTemplate]="treeTemplate"
          [checkStrictly]="checkStrictly"
          [virtualItemSize]="virtualItemSize"
          [virtualMaxBufferPx]="virtualMaxBufferPx"
          [virtualMinBufferPx]="virtualMinBufferPx"
          [virtualHeight]="virtualHeight"
          (expandChange)="onExpandedKeysChange($event)"
          (click)="treeClick.emit($event)"
          (checkedKeysChange)="updateSelectedNodes()"
          (selectedKeysChange)="updateSelectedNodes()"
          (checkboxChange)="treeCheckboxChange.emit($event)"
          (searchValueChange)="setSearchValues($event)"
        ></tri-tree>
        @if (nodes.length === 0 || isNotFound) {
          <span class="tri-select-not-found">
            <tri-embed-empty [componentName]="'tree-select'" [specificContent]="notFoundContent" />
          </span>
        }
      </div>
    </ng-template>

    <div cdkOverlayOrigin class="tri-select-selector">
      @if (prefix; as prefix) {
        <div class="tri-select-prefix">
          <ng-container *stringTemplateOutlet="prefix">{{ prefix }}</ng-container>
        </div>
      }

      <span class="tri-select-selection-wrap">
        @if (isMultiple) {
          <div class="tri-select-selection-overflow">
            @for (node of selectedNodes | slice: 0 : maxTagCount; track node.key) {
              <div class="tri-select-selection-overflow-item">
                <tri-select-item
                  deletable
                  [disabled]="node.isDisabled || disabled"
                  [label]="displayWith(node)"
                  displayLabelInHtml
                  (delete)="removeSelected(node, true)"
                />
              </div>
            }
            @if (selectedNodes.length > maxTagCount) {
              <div class="tri-select-selection-overflow-item">
                <tri-select-item
                  [contentTemplateOutlet]="maxTagPlaceholder"
                  [contentTemplateOutletContext]="selectedNodes | slice: maxTagCount"
                  [label]="'+ ' + (selectedNodes.length - maxTagCount) + ' ...'"
                />
              </div>
            }
            <div class="tri-select-selection-overflow-item tri-select-selection-overflow-item-suffix">
              <tri-select-search
                [id]="id"
                [showInput]="showSearch"
                (keydown)="onKeyDownInput($event)"
                (isComposingChange)="isComposingChange($event)"
                (valueChange)="setInputValue($event)"
                [value]="inputValue"
                [mirrorSync]="true"
                [disabled]="disabled"
                [focusTrigger]="open"
              />
            </div>
          </div>
        } @else {
          <tri-select-search
            [id]="id"
            [showInput]="showSearch"
            (keydown)="onKeyDownInput($event)"
            (isComposingChange)="isComposingChange($event)"
            (valueChange)="setInputValue($event)"
            [value]="inputValue"
            [mirrorSync]="false"
            [disabled]="disabled"
            [focusTrigger]="open"
          />
          @if (selectedNodes.length === 1 && !isComposing && inputValue === '') {
            <tri-select-item [label]="displayWith(selectedNodes[0])" displayLabelInHtml />
          }
        }

        @if (placeHolder && selectedNodes.length === 0) {
          <tri-select-placeholder [placeholder]="placeHolder" [style.display]="placeHolderDisplay" />
        }
      </span>

      <tri-select-arrow
        [showArrow]="true"
        [search]="open && showSearch"
        [suffixIcon]="suffixIcon"
        [feedbackIcon]="feedbackIconTpl"
      >
        <ng-template #feedbackIconTpl>
          @if (hasFeedback && !!status) {
            <tri-form-item-feedback-icon [status]="status" />
          }
        </ng-template>
      </tri-select-arrow>

      @if (allowClear && !disabled && selectedNodes.length) {
        <tri-select-clear (clear)="onClearSelection()" />
      }
    </div>
  `,
  providers: [
    TriTreeSelectService,
    { provide: TRI_SPACE_COMPACT_ITEM_TYPE, useValue: 'select' },
    {
      provide: TriTreeHigherOrderServiceToken,
      useExisting: TriTreeSelectService
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriTreeSelectComponent),
      multi: true
    }
  ],
  host: {
    class: 'tri-select ant-tree-select',
    '[class.tri-select-in-form-item]': '!!formStatusService',
    '[class.tri-select-rtl]': 'dir==="rtl"',
    '[class.tri-select-lg]': 'finalSize() === "large"',
    '[class.tri-select-sm]': 'finalSize() === "small"',
    '[class.tri-select-disabled]': 'disabled',
    '[class.tri-select-single]': '!isMultiple',
    '[class.tri-select-show-arrow]': '!isMultiple',
    '[class.tri-select-show-search]': '!isMultiple',
    '[class.tri-select-borderless]': 'variant === "borderless"',
    '[class.tri-select-filled]': 'variant === "filled"',
    '[class.tri-select-underlined]': 'variant === "underlined"',
    '[class.tri-select-multiple]': 'isMultiple',
    '[class.tri-select-allow-clear]': 'allowClear',
    '[class.tri-select-open]': 'open',
    '[class.tri-select-focused]': 'open || focused',
    '(click)': 'trigger()',
    '(keydown)': 'onKeydown($event)'
  },
  hostDirectives: [TriSpaceCompactItemDirective]
})
export class TriTreeSelectComponent extends TriTreeBase implements ControlValueAccessor, OnInit, OnChanges {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  private renderer = inject(Renderer2);
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private directionality = inject(Directionality);
  private focusMonitor = inject(FocusMonitor);
  private destroyRef = inject(DestroyRef);

  protected readonly slideAnimationEnter = slideAnimationEnter();
  protected readonly slideAnimationLeave = slideAnimationLeave();

  @Input() id: string | null = null;
  @Input({ transform: booleanAttribute }) allowClear: boolean = true;
  @Input({ transform: booleanAttribute }) showExpand: boolean = true;
  @Input({ transform: booleanAttribute }) showLine: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() dropdownMatchSelectWidth: boolean = true;
  @Input({ transform: booleanAttribute }) checkable: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() hideUnMatched: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showIcon: boolean = false;
  @Input({ transform: booleanAttribute }) showSearch: boolean = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) asyncData = false;
  @Input({ transform: booleanAttribute }) multiple = false;
  @Input({ transform: booleanAttribute }) defaultExpandAll = false;
  @Input({ transform: booleanAttribute }) checkStrictly = false;
  @Input() virtualItemSize = 28;
  @Input() virtualMaxBufferPx = 500;
  @Input() virtualMinBufferPx = 28;
  @Input() virtualHeight: string | null = null;
  @Input() expandedIcon?: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }>;
  @Input() notFoundContent?: string | TemplateRef<void>;
  @Input() nodes: TriTreeNodeOptions[] | TriTreeNode[] = [];
  @Input() open = false;
  @Input() @WithConfig() size: TriSizeLDSType = 'default';
  @Input() @WithConfig() variant: TriVariant = 'outlined';
  @Input() placeHolder = '';
  @Input() dropdownStyle: NgStyleInterface | null = null;
  @Input() dropdownClassName?: string;
  @Input() @WithConfig() backdrop = false;
  @Input() status: TriStatus = '';
  @Input() placement: TriPlacementType = '';
  @Input()
  set expandedKeys(value: string[]) {
    this._expandedKeys = value;
  }
  get expandedKeys(): string[] {
    return this._expandedKeys;
  }

  @Input() prefix: TemplateRef<TriSafeAny> | string | null = null;
  @Input() suffixIcon: TemplateRef<TriSafeAny> | string | null = null;
  @Input() displayWith: (node: TriTreeNode) => string | undefined = (node: TriTreeNode) => node.title;
  @Input({ transform: numberAttribute }) maxTagCount!: number;
  @Input() maxTagPlaceholder: TemplateRef<{ $implicit: TriTreeNode[] }> | null = null;
  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly cleared = new EventEmitter<void>();
  @Output() readonly removed = new EventEmitter<TriTreeNode>();
  @Output() readonly expandChange = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly treeClick = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly treeCheckboxChange = new EventEmitter<TriFormatEmitEvent>();

  @ViewChild(TriSelectSearchComponent, { static: false }) selectSearchComponent!: TriSelectSearchComponent;
  @ViewChild('treeRef', { static: false }) treeRef!: TriTreeComponent;
  @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin!: CdkOverlayOrigin;
  @ViewChild(CdkConnectedOverlay, { static: false }) cdkConnectedOverlay!: CdkConnectedOverlay;

  @Input() treeTemplate!: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }>;
  @ContentChild('nzTreeTemplate', { static: true }) treeTemplateChild!: TemplateRef<{
    $implicit: TriTreeNode;
    origin: TriTreeNodeOptions;
  }>;
  get _treeTemplate(): TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }> {
    return this.treeTemplate || this.treeTemplateChild;
  }

  prefixCls: string = 'ant-select';
  statusCls: NgClassInterface = {};
  _status: TriValidateStatus = '';
  hasFeedback: boolean = false;

  _dropdownClassName = TREE_SELECT_DEFAULT_CLASS;
  triggerWidth?: number;
  isComposing = false;
  isNotFound = false;
  focused = false;
  inputValue = '';
  dropdownPosition: 'top' | 'center' | 'bottom' = 'bottom';
  selectedNodes: TriTreeNode[] = [];
  _expandedKeys: string[] = [];
  value: string[] = [];
  dir: Direction = 'ltr';
  positions: ConnectionPositionPair[] = [];

  protected finalSize = computed(() => {
    if (this.compactSize) {
      return this.compactSize();
    }
    return this.#size();
  });

  #size = signal<TriSizeLDSType>(this.size);
  private compactSize = inject(TRI_SPACE_COMPACT_SIZE, { optional: true });
  private isNzDisableFirstChange: boolean = true;
  private isComposingChange$ = new Subject<boolean>();
  private searchValueChange$ = new Subject<string>();

  onChange: OnChangeType = _value => {};
  onTouched: OnTouchedType = () => {};

  get placeHolderDisplay(): string {
    return this.inputValue || this.isComposing || this.selectedNodes.length ? 'none' : 'block';
  }

  get isMultiple(): boolean {
    return this.multiple || this.checkable;
  }

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  constructor() {
    super(inject(TriTreeSelectService));

    this.destroyRef.onDestroy(() => {
      this.closeDropdown();
    });

    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => {
      this.#size.set(this.size);
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.#size.set(this.size);

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

    this.subscribeSelectionChange();

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;

    this.focusMonitor
      .monitor(this.elementRef, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          this.focused = false;
          this.cdr.markForCheck();
          Promise.resolve().then(() => {
            this.onTouched();
          });
        } else {
          this.focused = true;
          this.cdr.markForCheck();
        }
      });

    // setInputValue method executed earlier than isComposingChange
    combineLatest([this.searchValueChange$, this.isComposingChange$.pipe(startWith(false))])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([searchValue, isComposing]) => {
        this.isComposing = isComposing;
        if (!isComposing) {
          this.inputValue = searchValue;
          this.updatePosition();
        }
      });
  }

  isComposingChange(isComposing: boolean): void {
    this.isComposingChange$.next(isComposing);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = (this.isNzDisableFirstChange && this.disabled) || isDisabled;
    this.closeDropdown();
    this.isNzDisableFirstChange = false;
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

  ngOnChanges({ nzNodes, nzDropdownClassName, nzStatus, nzPlacement, nzSize }: SimpleChanges): void {
    if (nzNodes) {
      this.updateSelectedNodes(true);
    }
    if (nzDropdownClassName) {
      const className = this.dropdownClassName && this.dropdownClassName.trim();
      this._dropdownClassName = className ? `${TREE_SELECT_DEFAULT_CLASS} ${className}` : TREE_SELECT_DEFAULT_CLASS;
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }

    if (nzPlacement && this.placement) {
      if (POSITION_MAP[this.placement]) {
        this.positions = [POSITION_MAP[this.placement]];
      }
    }
    if (nzSize) {
      this.#size.set(nzSize.currentValue);
    }
  }

  writeValue(value: string[] | string): void {
    if (isNotNil(value)) {
      if (this.isMultiple && Array.isArray(value)) {
        this.value = value;
      } else {
        this.value = [value as string];
      }
      // need clear selected nodes when user set value before updating
      this.clearSelectedNodes();
      this.updateSelectedNodes(true);
    } else {
      this.value = [];
      this.clearSelectedNodes();
      this.selectedNodes = [];
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (_: string[] | string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    switch (event.keyCode) {
      case ESCAPE:
        /**
         * Skip the ESCAPE processing, it will be handled in {@link onOverlayKeyDown}.
         */
        break;
      case TAB:
        this.closeDropdown();
        break;
      default:
        if (!this.open) {
          this.openDropdown();
        }
    }
  }

  trigger(): void {
    if (this.disabled || (!this.disabled && this.open)) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    if (!this.disabled) {
      this.open = true;
      this.openChange.emit(this.open);
      this.updateCdkConnectedOverlayStatus();
      if (this.showSearch || this.isMultiple) {
        this.focusOnInput();
      }
    }
  }

  closeDropdown(): void {
    Promise.resolve().then(() => this.onTouched());
    this.open = false;
    this.inputValue = '';
    this.isNotFound = false;
    this.openChange.emit(this.open);
    this.cdr.markForCheck();
  }

  onKeyDownInput(e: KeyboardEvent): void {
    const keyCode = e.keyCode;
    const eventTarget = e.target as HTMLInputElement;
    if (this.isMultiple && !eventTarget.value && keyCode === BACKSPACE) {
      e.preventDefault();
      if (this.selectedNodes.length) {
        const removeNode = this.selectedNodes[this.selectedNodes.length - 1];
        if (removeNode && !removeNode.isDisabled) {
          this.removeSelected(removeNode);
        }
      }
    }
  }

  onExpandedKeysChange(value: TriFormatEmitEvent): void {
    this.expandChange.emit(value);
    this._expandedKeys = [...value.keys!];
  }

  setInputValue(value: string): void {
    this.searchValueChange$.next(value);
  }

  removeSelected(node: TriTreeNode, emit: boolean = true): void {
    node.isSelected = false;
    node.isChecked = false;
    if (this.checkable) {
      this.nzTreeService.conduct(node, this.checkStrictly);
    } else {
      this.nzTreeService.setSelectedNodeList(node, this.multiple);
    }

    if (emit) {
      this.removed.emit(node);
    }
  }

  focusOnInput(): void {
    if (this.selectSearchComponent) {
      this.selectSearchComponent.focus();
    }
  }

  subscribeSelectionChange(): void {
    merge(
      this.treeClick.pipe(
        tap((event: TriFormatEmitEvent) => {
          const node = event.node!;
          if (this.checkable && !node.isDisabled && !node.isDisableCheckbox) {
            node.isChecked = !node.isChecked;
            node.isHalfChecked = false;
            if (!this.checkStrictly) {
              this.nzTreeService.conduct(node);
            }
          }
          if (this.checkable) {
            node.isSelected = false;
          }
        }),
        filter((event: TriFormatEmitEvent) => {
          const node = event.node!;
          return this.checkable ? !node.isDisabled && !node.isDisableCheckbox : !node.isDisabled && node.isSelectable;
        })
      ),
      this.checkable ? this.treeCheckboxChange.asObservable() : observableOf(),
      this.cleared,
      this.removed
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateSelectedNodes();
        const value = this.selectedNodes.map(node => node.key!);
        this.value = [...value];
        if (this.showSearch || this.isMultiple) {
          this.inputValue = '';
          this.isNotFound = false;
        }
        if (this.isMultiple) {
          this.onChange(value);
          this.focusOnInput();
          this.updatePosition();
        } else {
          this.closeDropdown();
          this.onChange(value.length ? value[0] : null);
        }
      });
  }

  updateSelectedNodes(init: boolean = false): void {
    if (init) {
      const nodes = this.coerceTreeNodes(this.nodes);
      this.nzTreeService.isMultiple = this.isMultiple;
      this.nzTreeService.isCheckStrictly = this.checkStrictly;
      this.nzTreeService.initTree(nodes);
      if (this.checkable) {
        this.nzTreeService.conductCheck(this.value, this.checkStrictly);
      } else {
        this.nzTreeService.conductSelectedKeys(this.value, this.isMultiple);
      }
    }

    this.selectedNodes = [...(this.checkable ? this.getCheckedNodeList() : this.getSelectedNodeList())].sort(
      (a, b) => {
        const indexA = this.value.indexOf(a.key);
        const indexB = this.value.indexOf(b.key);
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
  }

  updatePosition(): void {
    requestAnimationFrame(() => {
      this.cdkConnectedOverlay?.overlayRef?.updatePosition();
    });
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    this.dropdownPosition = position.connectionPair.originY;
  }

  onClearSelection(): void {
    this.selectedNodes.forEach(node => {
      this.removeSelected(node, false);
    });
    this.cleared.emit();
  }

  onClickOutside(event: MouseEvent): void {
    const target = _getEventTarget(event);
    if (!this.elementRef.nativeElement.contains(target)) {
      this.closeDropdown();
    }
  }

  setSearchValues($event: TriFormatEmitEvent): void {
    Promise.resolve().then(() => {
      this.isNotFound = (this.showSearch || this.isMultiple) && !!this.inputValue && $event.matchedKeys!.length === 0;
    });
  }

  updateCdkConnectedOverlayStatus(): void {
    if (!this.placement || !listOfPositions.includes(POSITION_MAP[this.placement])) {
      this.triggerWidth = this.cdkOverlayOrigin.elementRef.nativeElement.getBoundingClientRect().width;
    }
  }

  clearSelectedNodes(): void {
    this.selectedNodes.forEach(node => {
      this.removeSelected(node, false);
    });
  }
}
