/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  TriFormatBeforeDropEvent,
  TriFormatEmitEvent,
  TriTreeBaseService,
  TriTreeNode,
  TriTreeNodeOptions
} from 'ng-zorro-antd/core/tree';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriTreeIndentComponent } from './tree-indent.component';
import { TriTreeNodeBuiltinCheckboxComponent } from './tree-node-checkbox.component';
import { TriTreeNodeSwitcherComponent } from './tree-node-switcher.component';
import { TriTreeNodeTitleComponent } from './tree-node-title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tri-tree-node[builtin]',
  exportAs: 'triTreeBuiltinNode',
  template: `
    <tri-tree-indent
      [treeLevel]="treeNode.level"
      [selectMode]="selectMode"
      [isStart]="isStart"
      [isEnd]="isEnd"
    />
    @if (showExpand) {
      <tri-tree-node-switcher
        [showExpand]="showExpand"
        [showLine]="showLine"
        [expandedIcon]="expandedIcon"
        [selectMode]="selectMode"
        [context]="treeNode"
        [isLeaf]="isLeaf"
        [isExpanded]="isExpanded"
        [isLoading]="isLoading"
        (click)="clickExpand($event)"
      />
    }
    @if (checkable) {
      <tri-tree-node-checkbox
        builtin
        (click)="clickCheckbox($event)"
        [selectMode]="selectMode"
        [isChecked]="isChecked"
        [isHalfChecked]="isHalfChecked"
        [isDisabled]="isDisabled"
        [isDisableCheckbox]="isDisableCheckbox"
      />
    }
    <tri-tree-node-title
      [icon]="icon"
      [title]="title"
      [isLoading]="isLoading"
      [isSelected]="isSelected"
      [isDisabled]="isDisabled"
      [isMatched]="isMatched"
      [isExpanded]="isExpanded"
      [isLeaf]="isLeaf"
      [searchValue]="searchValue"
      [treeTemplate]="treeTemplate"
      [draggable]="draggable"
      [showIcon]="showIcon"
      [selectMode]="selectMode"
      [context]="treeNode"
      [showIndicator]="showIndicator"
      [dragPosition]="dragPos"
      (dblclick)="dblClick($event)"
      (click)="clickSelect($event)"
      (contextmenu)="contextMenu($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tri-select-tree-treenode]': `selectMode`,
    '[class.tri-select-tree-treenode-disabled]': `selectMode && isDisabled`,
    '[class.tri-select-tree-treenode-switcher-open]': `selectMode && isSwitcherOpen`,
    '[class.tri-select-tree-treenode-switcher-close]': `selectMode && isSwitcherClose`,
    '[class.tri-select-tree-treenode-checkbox-checked]': `selectMode && isChecked`,
    '[class.tri-select-tree-treenode-checkbox-indeterminate]': `selectMode && isHalfChecked`,
    '[class.tri-select-tree-treenode-selected]': `selectMode && isSelected`,
    '[class.tri-select-tree-treenode-loading]': `selectMode && isLoading`,
    '[class.tri-tree-treenode]': `!selectMode`,
    '[class.tri-tree-treenode-disabled]': `!selectMode && isDisabled`,
    '[class.tri-tree-treenode-switcher-open]': `!selectMode && isSwitcherOpen`,
    '[class.tri-tree-treenode-switcher-close]': `!selectMode && isSwitcherClose`,
    '[class.tri-tree-treenode-checkbox-checked]': `!selectMode && isChecked`,
    '[class.tri-tree-treenode-checkbox-indeterminate]': `!selectMode && isHalfChecked`,
    '[class.tri-tree-treenode-selected]': `!selectMode && isSelected`,
    '[class.tri-tree-treenode-loading]': `!selectMode && isLoading`,
    '[class.dragging]': `draggingKey === nzTreeNode.key`,
    '[style.display]': 'displayStyle'
  },
  imports: [
    TriTreeIndentComponent,
    TriTreeNodeSwitcherComponent,
    TriTreeNodeBuiltinCheckboxComponent,
    TriTreeNodeTitleComponent
  ]
})
export class TriTreeNodeBuiltinComponent implements OnInit, OnChanges {
  private treeService = inject(TriTreeBaseService);
  private ngZone = inject(NgZone);
  private renderer = inject(Renderer2);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  @Input() icon: string = '';
  @Input() title: string = '';
  @Input({ transform: booleanAttribute }) isLoading: boolean = false;
  @Input({ transform: booleanAttribute }) isSelected: boolean = false;
  @Input({ transform: booleanAttribute }) isDisabled: boolean = false;
  @Input({ transform: booleanAttribute }) isMatched: boolean = false;
  @Input({ transform: booleanAttribute }) isExpanded!: boolean;
  @Input({ transform: booleanAttribute }) isLeaf!: boolean;
  @Input({ transform: booleanAttribute }) isChecked?: boolean;
  @Input({ transform: booleanAttribute }) isHalfChecked?: boolean;
  @Input({ transform: booleanAttribute }) isDisableCheckbox?: boolean;
  @Input({ transform: booleanAttribute }) isSelectable?: boolean;
  @Input({ transform: booleanAttribute }) canHide?: boolean;
  @Input() isStart: boolean[] = [];
  @Input() isEnd: boolean[] = [];
  @Input() treeNode!: TriTreeNode;
  @Input({ transform: booleanAttribute }) showLine?: boolean;
  @Input({ transform: booleanAttribute }) showExpand?: boolean;
  @Input({ transform: booleanAttribute }) checkable?: boolean;
  @Input({ transform: booleanAttribute }) asyncData?: boolean;
  @Input({ transform: booleanAttribute }) hideUnMatched = false;
  @Input({ transform: booleanAttribute }) noAnimation = false;
  @Input({ transform: booleanAttribute }) selectMode = false;
  @Input({ transform: booleanAttribute }) showIcon = false;
  @Input() expandedIcon?: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }>;
  @Input() treeTemplate: TemplateRef<{ $implicit: TriTreeNode; origin: TriTreeNodeOptions }> | null = null;
  @Input() beforeDrop?: (confirm: TriFormatBeforeDropEvent) => Observable<boolean>;
  @Input() searchValue = '';
  @Input({ transform: booleanAttribute }) draggable: boolean = false;
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

  /**
   * drag var
   */
  destroy$ = new Subject<void>();
  dragPos = 2;
  dragPosClass: Record<string, string> = {
    0: 'drag-over',
    1: 'drag-over-gap-bottom',
    '-1': 'drag-over-gap-top'
  };
  draggingKey: string | null = null;
  showIndicator = false;
  /**
   * default set
   */
  get displayStyle(): string {
    // to hide unmatched nodes
    return this.searchValue && this.hideUnMatched && !this.isMatched && !this.isExpanded && this.canHide
      ? 'none'
      : '';
  }

  get isSwitcherOpen(): boolean {
    return this.isExpanded && !this.isLeaf;
  }

  get isSwitcherClose(): boolean {
    return !this.isExpanded && !this.isLeaf;
  }

  clickExpand(event: MouseEvent): void {
    event.preventDefault();
    if (!this.isLoading && !this.isLeaf) {
      // set async state
      if (this.asyncData && this.treeNode.children.length === 0 && !this.isExpanded) {
        this.treeNode.isLoading = true;
      }
      this.treeNode.setExpanded(!this.isExpanded);
    }
    this.treeService.setExpandedNodeList(this.treeNode);
    const eventNext = this.treeService.formatEvent('expand', this.treeNode, event);
    this.expandChange.emit(eventNext);
  }

  clickSelect(event: MouseEvent): void {
    event.preventDefault();
    if (this.isSelectable && !this.isDisabled) {
      this.treeNode.isSelected = !this.treeNode.isSelected;
    }
    this.treeService.setSelectedNodeList(this.treeNode);
    const eventNext = this.treeService.formatEvent('click', this.treeNode, event);
    this.click.emit(eventNext);
  }

  _dblClick(event: MouseEvent): void {
    event.preventDefault();
    const eventNext = this.treeService.formatEvent('dblclick', this.treeNode, event);
    this.dblClick.emit(eventNext);
  }

  _contextMenu(event: MouseEvent): void {
    const eventNext = this.treeService.formatEvent('contextmenu', this.treeNode, event);
    this.contextMenu.emit(eventNext);
  }

  clickCheckbox(event: MouseEvent): void {
    event.preventDefault();
    // return if the node is disabled
    if (this.isDisabled || this.isDisableCheckbox) {
      return;
    }
    this.treeNode.isChecked = !this.treeNode.isChecked;
    this.treeNode.isHalfChecked = false;
    this.treeService.setCheckedNodeList(this.treeNode);
    const eventNext = this.treeService.formatEvent('check', this.treeNode, event);
    this.checkboxChange.emit(eventNext);
  }

  clearDragClass(): void {
    const dragClass = ['drag-over-gap-top', 'drag-over-gap-bottom', 'drag-over', 'drop-target'];
    dragClass.forEach(e => this.renderer.removeClass(this.el, e));
  }

  handleDragStart(e: DragEvent): void {
    try {
      // i.e., throw error
      // firefox-need-it
      e.dataTransfer!.setData('text/plain', this.treeNode.key!);
    } catch {
      // noop
    }
    this.treeService.setSelectedNode(this.treeNode);
    this.draggingKey = this.treeNode.key;
    const eventNext = this.treeService.formatEvent('dragstart', this.treeNode, e);
    this.onDragStart.emit(eventNext);
  }

  handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    // reset position
    this.showIndicator = this.treeNode.key !== this.treeService.getSelectedNode()?.key;
    this.renderIndicator(2);
    this.ngZone.run(() => {
      const eventNext = this.treeService.formatEvent('dragenter', this.treeNode, e);
      this.onDragEnter.emit(eventNext);
    });
  }

  handleDragOver(e: DragEvent): void {
    e.preventDefault();
    const dropPosition = this.treeService.calcDropPosition(e);
    if (this.dragPos !== dropPosition) {
      this.clearDragClass();
      this.renderIndicator(dropPosition);
      // leaf node will pass
      if (!(this.dragPos === 0 && this.isLeaf)) {
        this.renderer.addClass(this.el, this.dragPosClass[this.dragPos]);
        this.renderer.addClass(this.el, 'drop-target');
      }
    }
    const eventNext = this.treeService.formatEvent('dragover', this.treeNode, e);
    this.onDragOver.emit(eventNext);
  }

  handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.renderIndicator(2);
    this.clearDragClass();
    const eventNext = this.treeService.formatEvent('dragleave', this.treeNode, e);
    this.onDragLeave.emit(eventNext);
  }

  handleDragDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.ngZone.run(() => {
      this.showIndicator = false;
      this.clearDragClass();
      const node = this.treeService.getSelectedNode();
      if (!node || (node && node.key === this.treeNode.key) || (this.dragPos === 0 && this.isLeaf)) {
        return;
      }
      // pass if node is leafNo
      const dropEvent = this.treeService.formatEvent('drop', this.treeNode, e);
      const dragEndEvent = this.treeService.formatEvent('dragend', this.treeNode, e);
      if (this.beforeDrop) {
        this.beforeDrop({
          dragNode: this.treeService.getSelectedNode()!,
          node: this.treeNode,
          pos: this.dragPos
        }).subscribe((canDrop: boolean) => {
          if (canDrop) {
            this.treeService.dropAndApply(this.treeNode, this.dragPos);
          }
          this.onDrop.emit(dropEvent);
          this.onDragEnd.emit(dragEndEvent);
        });
      } else if (this.treeNode) {
        this.treeService.dropAndApply(this.treeNode, this.dragPos);
        this.onDrop.emit(dropEvent);
      }
    });
  }

  handleDragEnd(e: DragEvent): void {
    e.preventDefault();
    this.ngZone.run(() => {
      if (!this.beforeDrop) {
        // clear dragging state
        this.draggingKey = null;
        const eventNext = this.treeService.formatEvent('dragend', this.treeNode, e);
        this.onDragEnd.emit(eventNext);
      } else {
        // clear dragging state
        this.draggingKey = null;
        this.markForCheck();
      }
    });
  }

  /**
   * Listening to dragging events.
   */
  handDragEvent(): void {
    if (this.draggable) {
      this.destroy$ = new Subject();
      fromEventOutsideAngular<DragEvent>(this.el, 'dragstart')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => this.handleDragStart(e));
      fromEventOutsideAngular<DragEvent>(this.el, 'dragenter')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => this.handleDragEnter(e));
      fromEventOutsideAngular<DragEvent>(this.el, 'dragover')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => this.handleDragOver(e));
      fromEventOutsideAngular<DragEvent>(this.el, 'dragleave')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => this.handleDragLeave(e));
      fromEventOutsideAngular<DragEvent>(this.el, 'drop')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => this.handleDragDrop(e));
      fromEventOutsideAngular<DragEvent>(this.el, 'dragend')
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => this.handleDragEnd(e));
    } else {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    });
  }

  ngOnInit(): void {
    this.treeNode.component = this;

    fromEventOutsideAngular(this.el, 'mousedown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (this.selectMode) {
          event.preventDefault();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDraggable } = changes;
    if (nzDraggable) {
      this.handDragEvent();
    }
  }

  private renderIndicator(dropPosition: number): void {
    this.ngZone.run(() => {
      this.showIndicator = dropPosition !== 2;
      if (this.treeNode.key === this.treeService.getSelectedNode()?.key || (dropPosition === 0 && this.isLeaf)) {
        return;
      }
      this.dragPos = dropPosition;
      this.cdr.markForCheck();
    });
  }
}
