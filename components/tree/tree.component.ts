/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  forwardRef,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';

import { treeCollapseMotion, TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import {
  TriFormatBeforeDropEvent,
  TriFormatEmitEvent,
  TriTreeBase,
  TriTreeBaseService,
  TriTreeHigherOrderServiceToken,
  TriTreeNode,
  TriTreeNodeKey,
  TriTreeNodeOptions,
  flattenTreeData
} from 'ng-zorro-antd/core/tree';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTreeNodeBuiltinComponent } from './tree-node.component';
import { TriTreeService } from './tree.service';

export function NzTreeServiceFactory(): TriTreeBaseService {
  const higherOrderService = inject(TriTreeHigherOrderServiceToken, { skipSelf: true, optional: true });
  const treeService = inject(TriTreeService);
  return higherOrderService ?? treeService;
}

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'tree';

@Component({
  selector: 'tri-tree',
  exportAs: 'triTree',
  animations: [treeCollapseMotion],
  template: `
    <div>
      <input [style]="HIDDEN_STYLE" />
    </div>
    <div class="tri-tree-treenode" [style]="HIDDEN_NODE_STYLE">
      <div class="tri-tree-indent">
        <div class="tri-tree-indent-unit"></div>
      </div>
    </div>
    <div class="tri-tree-list" [class.tri-select-tree-list]="selectMode" style="position: relative">
      @if (virtualHeight) {
        <cdk-virtual-scroll-viewport
          [class.tri-select-tree-list-holder-inner]="selectMode"
          [class.tri-tree-list-holder-inner]="!selectMode"
          [itemSize]="virtualItemSize"
          [minBufferPx]="virtualMinBufferPx"
          [maxBufferPx]="virtualMaxBufferPx"
          [style.height]="virtualHeight"
        >
          <ng-container *cdkVirtualFor="let node of flattenNodes; trackBy: trackByFlattenNode">
            <ng-template
              [ngTemplateOutlet]="nodeTemplate"
              [ngTemplateOutletContext]="{ $implicit: node }"
            ></ng-template>
          </ng-container>
        </cdk-virtual-scroll-viewport>
      } @else {
        <div
          [class.tri-select-tree-list-holder-inner]="selectMode"
          [class.tri-tree-list-holder-inner]="!selectMode"
          [@.disabled]="beforeInit || !!noAnimation?.nzNoAnimation?.()"
          [noAnimation]="noAnimation?.nzNoAnimation?.()"
          [@treeCollapseMotion]="flattenNodes.length"
        >
          @for (node of flattenNodes; track trackByFlattenNode($index, node)) {
            <ng-template
              [ngTemplateOutlet]="nodeTemplate"
              [ngTemplateOutletContext]="{ $implicit: node }"
            ></ng-template>
          }
        </div>
      }
    </div>
    <ng-template #nodeTemplate let-treeNode>
      <tri-tree-node
        builtin
        [icon]="treeNode.icon"
        [title]="treeNode.title"
        [isLoading]="treeNode.isLoading"
        [isSelected]="treeNode.isSelected"
        [isDisabled]="treeNode.isDisabled"
        [isMatched]="treeNode.isMatched"
        [isExpanded]="treeNode.isExpanded"
        [isLeaf]="treeNode.isLeaf"
        [isStart]="treeNode.isStart"
        [isEnd]="treeNode.isEnd"
        [isChecked]="treeNode.isChecked"
        [isHalfChecked]="treeNode.isHalfChecked"
        [isDisableCheckbox]="treeNode.isDisableCheckbox"
        [isSelectable]="treeNode.isSelectable"
        [canHide]="treeNode.canHide"
        [treeNode]="treeNode"
        [selectMode]="selectMode"
        [showLine]="showLine"
        [expandedIcon]="expandedIcon"
        [draggable]="draggable"
        [checkable]="checkable"
        [showExpand]="showExpand"
        [asyncData]="asyncData"
        [searchValue]="searchValue"
        [hideUnMatched]="hideUnMatched"
        [beforeDrop]="beforeDrop"
        [showIcon]="showIcon"
        [treeTemplate]="treeTemplate || treeTemplateChild"
        (expandChange)="eventTriggerChanged($event)"
        (click)="eventTriggerChanged($event)"
        (dblClick)="eventTriggerChanged($event)"
        (contextMenu)="eventTriggerChanged($event)"
        (checkboxChange)="eventTriggerChanged($event)"
        (onDragStart)="eventTriggerChanged($event)"
        (onDragEnter)="eventTriggerChanged($event)"
        (onDragOver)="eventTriggerChanged($event)"
        (onDragLeave)="eventTriggerChanged($event)"
        (onDragEnd)="eventTriggerChanged($event)"
        (onDrop)="eventTriggerChanged($event)"
      ></tri-tree-node>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TriTreeService,
    {
      provide: TriTreeBaseService,
      useFactory: NzTreeServiceFactory
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriTreeComponent),
      multi: true
    }
  ],
  host: {
    '[class.tri-select-tree]': `selectMode`,
    '[class.tri-select-tree-show-line]': `selectMode && showLine`,
    '[class.tri-select-tree-icon-hide]': `selectMode && !showIcon`,
    '[class.tri-select-tree-block-node]': `selectMode && blockNode`,
    '[class.tri-tree]': `!selectMode`,
    '[class.tri-tree-rtl]': `dir === 'rtl'`,
    '[class.tri-tree-show-line]': `!selectMode && showLine`,
    '[class.tri-tree-icon-hide]': `!selectMode && !showIcon`,
    '[class.tri-tree-block-node]': `!selectMode && blockNode`,
    '[class.draggable-tree]': `nzDraggable`
  },
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    NgTemplateOutlet,
    TriNoAnimationDirective,
    TriTreeNodeBuiltinComponent
  ]
})
export class TriTreeComponent extends TriTreeBase implements OnInit, ControlValueAccessor, OnChanges, AfterViewInit {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  noAnimation = inject(TriNoAnimationDirective, { host: true, optional: true });
  configService = inject(TriConfigService);
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @Input({ transform: booleanAttribute }) @WithConfig() showIcon: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() hideUnMatched: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() blockNode: boolean = false;
  @Input({ transform: booleanAttribute }) expandAll = false;
  @Input({ transform: booleanAttribute }) selectMode = false;
  @Input({ transform: booleanAttribute }) checkStrictly = false;
  @Input({ transform: booleanAttribute }) showExpand: boolean = true;
  @Input({ transform: booleanAttribute }) showLine = false;
  @Input({ transform: booleanAttribute }) checkable = false;
  @Input({ transform: booleanAttribute }) asyncData = false;
  @Input({ transform: booleanAttribute }) draggable: boolean = false;
  @Input({ transform: booleanAttribute }) multiple = false;
  @Input() expandedIcon?: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }>;
  @Input() virtualItemSize = 28;
  @Input() virtualMaxBufferPx = 500;
  @Input() virtualMinBufferPx = 28;
  @Input() virtualHeight: string | null = null;
  @Input() treeTemplate?: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }>;
  @Input() beforeDrop?: (confirm: TriFormatBeforeDropEvent) => Observable<boolean>;
  @Input() data: TriTreeNodeOptions[] | TriTreeNode[] = [];
  @Input() expandedKeys: TriTreeNodeKey[] = [];
  @Input() selectedKeys: TriTreeNodeKey[] = [];
  @Input() checkedKeys: TriTreeNodeKey[] = [];
  @Input() searchValue: string = '';
  @Input() searchFunc?: (node: TriTreeNodeOptions) => boolean;
  @ContentChild('nzTreeTemplate', { static: true }) treeTemplateChild!: TemplateRef<{
    $implicit: TriTreeNode;
    origin: TriTreeNodeOptions;
  }>;
  @ViewChild(CdkVirtualScrollViewport, { read: CdkVirtualScrollViewport })
  cdkVirtualScrollViewport!: CdkVirtualScrollViewport;
  flattenNodes: TriTreeNode[] = [];
  beforeInit = true;
  dir: Direction = 'ltr';

  @Output() readonly expandedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() readonly selectedKeysChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() readonly checkedKeysChange: EventEmitter<TriTreeNodeKey[]> = new EventEmitter<TriTreeNodeKey[]>();
  @Output() readonly searchValueChange = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly click = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly dblClick = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly contextMenu = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly checkboxChange = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly expandChange = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly onDragStart = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly onDragEnter = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly onDragOver = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly onDragLeave = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly onDrop = new EventEmitter<TriFormatEmitEvent>();
  @Output() readonly onDragEnd = new EventEmitter<TriFormatEmitEvent>();

  HIDDEN_STYLE = {
    width: 0,
    height: 0,
    display: 'flex',
    overflow: 'hidden',
    opacity: 0,
    border: 0,
    padding: 0,
    margin: 0
  };

  HIDDEN_NODE_STYLE = {
    position: 'absolute',
    pointerEvents: 'none',
    visibility: 'hidden',
    height: 0,
    overflow: 'hidden'
  };

  onChange: (value: TriTreeNode[]) => void = () => null;
  onTouched: () => void = () => null;

  writeValue(value: TriTreeNode[]): void {
    this.handleNzData(value);
  }

  registerOnChange(fn: (_: TriTreeNode[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Render all properties of nzTree
   *
   * @param changes all changes from @Input
   */
  renderTreeProperties(changes: SimpleChanges): void {
    let useDefaultExpandedKeys = false;
    let expandAll = false;
    const {
      nzData,
      nzExpandedKeys,
      nzSelectedKeys,
      nzCheckedKeys,
      nzCheckStrictly,
      nzExpandAll,
      nzMultiple,
      nzSearchValue
    } = changes;

    if (nzExpandAll) {
      useDefaultExpandedKeys = true;
      expandAll = this.expandAll;
    }

    if (nzMultiple) {
      this.nzTreeService.isMultiple = this.multiple;
    }

    if (nzCheckStrictly) {
      this.nzTreeService.isCheckStrictly = this.checkStrictly;
    }

    if (nzData) {
      this.handleNzData(this.data);
    }

    if (nzCheckedKeys) {
      this.handleCheckedKeys(this.checkedKeys);
    }

    if (nzCheckStrictly) {
      this.handleCheckedKeys(null);
    }

    if (nzExpandedKeys || nzExpandAll) {
      useDefaultExpandedKeys = true;
      this.handleExpandedKeys(expandAll || this.expandedKeys);
    }

    if (nzSelectedKeys) {
      this.handleSelectedKeys(this.selectedKeys, this.multiple);
    }

    if (nzSearchValue) {
      if (!(nzSearchValue.firstChange && !this.searchValue)) {
        useDefaultExpandedKeys = false;
        this.handleSearchValue(nzSearchValue.currentValue, this.searchFunc);
        this.searchValueChange.emit(this.nzTreeService.formatEvent('search', null, null));
      }
    }

    // flatten data
    const currentExpandedKeys = this.getExpandedNodeList().map(v => v.key);
    const newExpandedKeys = useDefaultExpandedKeys ? expandAll || this.expandedKeys : currentExpandedKeys;
    this.handleFlattenNodes(this.nzTreeService.rootNodes, newExpandedKeys);
  }

  trackByFlattenNode(_: number, node: TriTreeNode): string {
    return node.key;
  }
  // Deal with properties
  /**
   * nzData
   *
   * @param value
   */
  handleNzData(value: TriSafeAny[]): void {
    if (Array.isArray(value)) {
      const data = this.coerceTreeNodes(value);
      this.nzTreeService.initTree(data);
    }
  }

  handleFlattenNodes(data: TriTreeNode[], expandKeys: TriTreeNodeKey[] | true = []): void {
    this.nzTreeService.flattenTreeData(data, expandKeys);
  }

  handleCheckedKeys(keys: TriTreeNodeKey[] | null): void {
    this.nzTreeService.conductCheck(keys, this.checkStrictly);
  }

  handleExpandedKeys(keys: TriTreeNodeKey[] | true = []): void {
    this.nzTreeService.conductExpandedKeys(keys);
  }

  handleSelectedKeys(keys: TriTreeNodeKey[], isMulti: boolean): void {
    this.nzTreeService.conductSelectedKeys(keys, isMulti);
  }

  handleSearchValue(value: string, searchFunc?: (node: TriTreeNodeOptions) => boolean): void {
    const dataList = flattenTreeData(this.nzTreeService.rootNodes, true).map(v => v.data);
    const checkIfMatched = (node: TriTreeNode): boolean => {
      if (searchFunc) {
        return searchFunc(node.origin);
      }
      return !!value && node.title.toLowerCase().includes(value.toLowerCase());
    };
    dataList.forEach(v => {
      v.isMatched = checkIfMatched(v);
      v.canHide = !v.isMatched;
      if (!v.isMatched) {
        v.setExpanded(false);
        this.nzTreeService.setExpandedNodeList(v);
      } else {
        // expand
        this.nzTreeService.expandNodeAllParentBySearch(v);
      }
      this.nzTreeService.setMatchedNodeList(v);
    });
  }

  /**
   * Handle emit event
   *
   * @param event
   * handle each event
   */
  eventTriggerChanged(event: TriFormatEmitEvent): void {
    const node = event.node!;
    switch (event.eventName) {
      case 'expand':
        this.renderTree();
        this.expandChange.emit(event);
        break;
      case 'click':
        this.click.emit(event);
        break;
      case 'dblclick':
        this.dblClick.emit(event);
        break;
      case 'contextmenu':
        this.contextMenu.emit(event);
        break;
      case 'check': {
        // Render checked state with nodes' property `isChecked`
        this.nzTreeService.setCheckedNodeList(node);
        if (!this.checkStrictly) {
          this.nzTreeService.conduct(node);
        }
        // Cause check method will rerender list, so we need recover it and next the new event to user
        const eventNext = this.nzTreeService.formatEvent('check', node, event.event!);
        this.checkboxChange.emit(eventNext);
        const checkedKeys = this.nzTreeService.getCheckedNodeKeys();
        this.checkedKeysChange.emit(checkedKeys);
        break;
      }
      case 'dragstart':
        // if node is expanded
        if (node.isExpanded) {
          node.setExpanded(!node.isExpanded);
          this.renderTree();
        }
        this.onDragStart.emit(event);
        break;
      case 'dragenter': {
        const selectedNode = this.nzTreeService.getSelectedNode();
        if (selectedNode && selectedNode.key !== node.key && !node.isExpanded && !node.isLeaf) {
          node.setExpanded(true);
          this.renderTree();
        }
        this.onDragEnter.emit(event);
        break;
      }
      case 'dragover':
        this.onDragOver.emit(event);
        break;
      case 'dragleave':
        this.onDragLeave.emit(event);
        break;
      case 'dragend':
        this.onDragEnd.emit(event);
        break;
      case 'drop':
        this.renderTree();
        this.onDrop.emit(event);
        break;
    }
  }

  /**
   * Click expand icon
   */
  renderTree(): void {
    this.handleFlattenNodes(
      this.nzTreeService.rootNodes,
      this.getExpandedNodeList().map(v => v.key)
    );
    this.cdr.markForCheck();
  }

  constructor() {
    super(inject(TriTreeBaseService));
  }

  ngOnInit(): void {
    this.nzTreeService.flattenNodes$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.flattenNodes =
        !!this.virtualHeight && this.hideUnMatched && this.searchValue?.length > 0
          ? data.filter(d => !d.canHide)
          : data;
      this.cdr.markForCheck();
    });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderTreeProperties(changes);
  }

  ngAfterViewInit(): void {
    this.beforeInit = false;
  }
}
