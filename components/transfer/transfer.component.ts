/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of as observableOf, of } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriFormNoStatusService, TriFormStatusService } from 'ng-zorro-antd/core/form';
import { NgClassInterface, NgStyleInterface, TriSafeAny, TriStatus, TriValidateStatus } from 'ng-zorro-antd/core/types';
import { getStatusClassNames, toArray } from 'ng-zorro-antd/core/util';
import { TriI18nService, TriTransferI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';

import {
  TransferCanMove,
  TransferChange,
  TransferDirection,
  TransferItem,
  TransferSearchChange,
  TransferSelectChange
} from './interface';
import { TriTransferListComponent } from './transfer-list.component';

@Component({
  selector: 'tri-transfer',
  exportAs: 'triTransfer',
  template: `
    <tri-transfer-list
      class="tri-transfer-list"
      [style]="listStyle"
      data-direction="left"
      direction="left"
      [titleText]="titles[0]"
      [showSelectAll]="showSelectAll"
      [dataSource]="leftDataSource"
      [filter]="leftFilter"
      [filterOption]="filterOption"
      (filterChange)="handleFilterChange($event)"
      [renderList]="renderList && renderList[0]"
      [render]="render"
      [disabled]="disabled"
      [showSearch]="showSearch"
      [searchPlaceholder]="searchPlaceholder || locale?.searchPlaceholder"
      [notFoundContent]="notFoundContent"
      [itemUnit]="itemUnit || locale?.itemUnit"
      [itemsUnit]="itemsUnit || locale?.itemsUnit"
      [footer]="footer"
      (handleSelect)="handleLeftSelect($event)"
      (handleSelectAll)="handleLeftSelectAll($event)"
    />
    @if (dir !== 'rtl') {
      <div class="tri-transfer-operation">
        @if (!oneWay) {
          <button
            tri-button
            type="button"
            (click)="moveToLeft()"
            [disabled]="disabled || !leftActive"
            type="primary"
            size="small"
          >
            <tri-icon type="left" />
            @if (operations[1]) {
              <span>{{ operations[1] }}</span>
            }
          </button>
        }
        <button
          tri-button
          type="button"
          (click)="moveToRight()"
          [disabled]="disabled || !rightActive"
          type="primary"
          size="small"
        >
          <tri-icon type="right" />
          @if (operations[0]) {
            <span>{{ operations[0] }}</span>
          }
        </button>
      </div>
    } @else {
      <div class="tri-transfer-operation">
        <button
          tri-button
          type="button"
          (click)="moveToRight()"
          [disabled]="disabled || !rightActive"
          type="primary"
          size="small"
        >
          <tri-icon type="left" />
          @if (operations[0]) {
            <span>{{ operations[0] }}</span>
          }
        </button>
        @if (!oneWay) {
          <button
            tri-button
            type="button"
            (click)="moveToLeft()"
            [disabled]="disabled || !leftActive"
            type="primary"
            size="small"
          >
            <tri-icon type="right" />
            @if (operations[1]) {
              <span>{{ operations[1] }}</span>
            }
          </button>
        }
      </div>
    }
    <tri-transfer-list
      class="tri-transfer-list"
      [style]="listStyle"
      data-direction="right"
      direction="right"
      [titleText]="titles[1]"
      [showSelectAll]="showSelectAll"
      [dataSource]="rightDataSource"
      [filter]="rightFilter"
      [filterOption]="filterOption"
      (filterChange)="handleFilterChange($event)"
      [renderList]="renderList && renderList[1]"
      [render]="render"
      [disabled]="disabled"
      [showSearch]="showSearch"
      [searchPlaceholder]="searchPlaceholder || locale?.searchPlaceholder"
      [notFoundContent]="notFoundContent"
      [itemUnit]="itemUnit || locale?.itemUnit"
      [itemsUnit]="itemsUnit || locale?.itemsUnit"
      [footer]="footer"
      [oneWay]="oneWay"
      (moveToLeft)="moveToLeft()"
      (handleSelect)="handleRightSelect($event)"
      (handleSelectAll)="handleRightSelectAll($event)"
    />
  `,
  host: {
    class: 'tri-transfer',
    '[class.tri-transfer-rtl]': `dir === 'rtl'`,
    '[class.tri-transfer-disabled]': `disabled`,
    '[class.tri-transfer-customize-list]': `renderList`
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriTransferListComponent, TriIconModule, TriButtonModule]
})
export class TriTransferComponent implements OnInit, OnChanges {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private i18n = inject(TriI18nService);
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private directionality = inject(Directionality);
  private formStatusService = inject(TriFormStatusService, { optional: true });
  private formNoStatusService = inject(TriFormNoStatusService, { optional: true });

  @ViewChildren(TriTransferListComponent) lists!: QueryList<TriTransferListComponent>;
  locale!: TriTransferI18nInterface;

  leftFilter = '';
  rightFilter = '';
  dir: Direction = 'ltr';

  // status
  prefixCls: string = 'ant-transfer';
  statusCls: NgClassInterface = {};
  hasFeedback: boolean = false;

  // #region fields

  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() dataSource: TransferItem[] = [];
  @Input() titles: string[] = ['', ''];
  @Input() operations: string[] = [];
  @Input() listStyle: NgStyleInterface = {};
  @Input({ transform: booleanAttribute }) showSelectAll = true;
  @Input() itemUnit?: string;
  @Input() itemsUnit?: string;
  @Input() canMove: (arg: TransferCanMove) => Observable<TransferItem[]> = (arg: TransferCanMove) => of(arg.list);
  @Input() renderList: Array<TemplateRef<TriSafeAny> | null> | null = null;
  @Input() render: TemplateRef<TriSafeAny> | null = null;
  @Input() footer: TemplateRef<TriSafeAny> | null = null;
  @Input({ transform: booleanAttribute }) showSearch = false;
  @Input() filterOption?: (inputValue: string, item: TransferItem) => boolean;
  @Input() searchPlaceholder?: string;
  @Input() notFoundContent?: string;
  @Input() targetKeys: string[] = [];
  @Input() selectedKeys: string[] = [];
  @Input() status: TriStatus = '';
  @Input({ transform: booleanAttribute }) oneWay: boolean = false;

  // events
  @Output() readonly change = new EventEmitter<TransferChange>();
  @Output() readonly searchChange = new EventEmitter<TransferSearchChange>();
  @Output() readonly selectChange = new EventEmitter<TransferSelectChange>();

  // #endregion

  // #region process data

  // left
  leftDataSource: TransferItem[] = [];
  lastLeftCheckedIndex?: number;

  // right
  rightDataSource: TransferItem[] = [];
  lastRightCheckedIndex?: number;

  isShiftPressed = false;

  @HostListener('window:keydown.shift')
  onTriggerShiftDown(): void {
    this.isShiftPressed = true;
  }

  @HostListener('window:keyup.shift')
  onTriggerShiftUp(): void {
    this.isShiftPressed = false;
  }

  @HostListener('mousedown', ['$event'])
  onTriggerMouseDown(event: MouseEvent): void {
    const isInsideTransfer = (event.target as HTMLElement).closest('.ant-transfer-list');
    if (event.shiftKey && isInsideTransfer) {
      event.preventDefault();
    }
  }

  private splitDataSource(): void {
    this.leftDataSource = [];
    this.rightDataSource = [];
    this.dataSource.forEach(record => {
      if (record.direction === 'right') {
        record.direction = 'right';
        this.rightDataSource.push(record);
      } else {
        record.direction = 'left';
        this.leftDataSource.push(record);
      }
    });
  }

  private getCheckedData(direction: TransferDirection): TransferItem[] {
    return this[direction === 'left' ? 'leftDataSource' : 'rightDataSource'].filter(w => w.checked);
  }

  handleLeftSelectAll = (checked: boolean): void => this.handleSelect('left', checked);
  handleRightSelectAll = (checked: boolean): void => this.handleSelect('right', checked);

  handleLeftSelect = (item: TransferItem): void => this.handleSelect('left', !!item.checked, item);
  handleRightSelect = (item: TransferItem): void => this.handleSelect('right', !!item.checked, item);

  handleSelect(direction: TransferDirection, checked: boolean, item?: TransferItem): void {
    if (item) {
      const datasource = direction === 'left' ? this.leftDataSource : this.rightDataSource;
      const currentIndex = datasource.findIndex(i => i.key === item.key);
      const lastCheckedIndex = this[direction === 'left' ? 'lastLeftCheckedIndex' : 'lastRightCheckedIndex'] ?? -1;
      if (this.isShiftPressed && lastCheckedIndex > -1) {
        const start = Math.min(lastCheckedIndex, currentIndex);
        const end = Math.max(lastCheckedIndex, currentIndex);
        for (let i = start; i <= end; i++) {
          const item = datasource[i];
          if (!item.disabled) {
            item.checked = checked;
          }
        }
        this.markForCheckAllList();
      }
      this[direction === 'left' ? 'lastLeftCheckedIndex' : 'lastRightCheckedIndex'] = currentIndex;
    }
    const list = this.getCheckedData(direction);
    const count = list.filter(i => !i.disabled).length;
    this.updateOperationStatus(direction, count);
    this.selectChange.emit({ direction, checked, list, item });
  }

  handleFilterChange(ret: { direction: TransferDirection; value: string }): void {
    this.searchChange.emit(ret);
  }

  // #endregion

  // #region operation

  leftActive = false;
  rightActive = false;

  private updateOperationStatus(direction: TransferDirection, count?: number): void {
    this[direction === 'right' ? 'leftActive' : 'rightActive'] =
      (typeof count === 'undefined' ? this.getCheckedData(direction).filter(w => !w.disabled).length : count) > 0;
  }

  moveToLeft = (): void => this.moveTo('left');
  moveToRight = (): void => this.moveTo('right');

  moveTo(direction: TransferDirection): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    this.updateOperationStatus(oppositeDirection, 0);
    const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const moveList = datasource.filter(item => item.checked === true && !item.disabled);
    this.canMove({ direction, list: moveList }).subscribe({
      next: newMoveList =>
        this.truthMoveTo(
          direction,
          newMoveList.filter(i => !!i)
        ),
      error: () => moveList.forEach(i => (i.checked = false))
    });
  }

  private truthMoveTo(direction: TransferDirection, list: TransferItem[]): void {
    const oppositeDirection = direction === 'left' ? 'right' : 'left';
    const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
    const targetDatasource = direction === 'left' ? this.leftDataSource : this.rightDataSource;
    for (const item of list) {
      item.checked = false;
      item.hide = false;
      item.direction = direction;
      datasource.splice(datasource.indexOf(item), 1);
    }
    targetDatasource.splice(0, 0, ...list);
    this.updateOperationStatus(oppositeDirection);
    this.change.emit({ from: oppositeDirection, to: direction, list });
    this.markForCheckAllList();
  }

  // #endregion

  private markForCheckAllList(): void {
    if (!this.lists) {
      return;
    }
    this.lists.forEach(i => i.markForCheck());
  }

  private handleNzTargetKeys(): void {
    const keys = toArray(this.targetKeys);
    const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('key');
    this.leftDataSource.forEach(e => {
      if (hasOwnKey(e) && keys.indexOf(e.key) !== -1 && !e.disabled) {
        e.checked = true;
      }
    });
    this.moveToRight();
  }

  private handleNzSelectedKeys(): void {
    const keys = toArray(this.selectedKeys);
    this.dataSource.forEach(e => {
      if (keys.indexOf(e.key) !== -1) {
        e.checked = true;
      }
    });

    const term = (ld: TransferItem): boolean => ld.disabled === false && ld.checked === true;
    this.rightActive = this.leftDataSource.some(term);
    this.leftActive = this.rightDataSource.some(term);
  }

  ngOnInit(): void {
    this.formStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => pre.status === cur.status && pre.hasFeedback === cur.hasFeedback),
        withLatestFrom(this.formNoStatusService ? this.formNoStatusService.noFormStatus : observableOf(false)),
        map(([{ status, hasFeedback }, noStatus]) => ({ status: noStatus ? '' : status, hasFeedback })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Transfer');
      this.markForCheckAllList();
    });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzStatus, nzDataSource, nzTargetKeys, nzSelectedKeys } = changes;
    if (nzDataSource) {
      this.splitDataSource();
      this.updateOperationStatus('left');
      this.updateOperationStatus('right');
      this.cdr.detectChanges();
      this.markForCheckAllList();
    }
    if (nzTargetKeys) {
      this.handleNzTargetKeys();
    }
    if (nzSelectedKeys) {
      this.handleNzSelectedKeys();
    }
    if (nzStatus) {
      this.setStatusStyles(this.status, this.hasFeedback);
    }
  }

  private setStatusStyles(status: TriValidateStatus, hasFeedback: boolean): void {
    // set inner status
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
