/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { measureScrollbar } from 'ng-zorro-antd/core/util';
import { TriPaginationModule, PaginationItemRenderContext } from 'ng-zorro-antd/pagination';
import { TriSpinComponent } from 'ng-zorro-antd/spin';

import { TriTableDataService } from '../table-data.service';
import { TriTableStyleService } from '../table-style.service';
import {
  TriCustomColumn,
  TriTableLayout,
  TriTablePaginationPosition,
  TriTablePaginationType,
  TriTableQueryParams,
  TriTableSize,
  TriTableSummaryFixedType
} from '../table.types';
import { TriTableInnerDefaultComponent } from './table-inner-default.component';
import { TriTableInnerScrollComponent } from './table-inner-scroll.component';
import { TriTableVirtualScrollDirective } from './table-virtual-scroll.directive';
import { TriTableTitleFooterComponent } from './title-footer.component';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'table';

@Component({
  selector: '',
  exportAs: 'triTable',
  providers: [TriTableStyleService, TriTableDataService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <tri-spin [delay]="loadingDelay" [spinning]="loading" [indicator]="loadingIndicator">
      @if (paginationPosition === 'both' || paginationPosition === 'top') {
        <ng-template [ngTemplateOutlet]="paginationTemplate"></ng-template>
      }
      <div
        #tableMainElement
        class="tri-table"
        [class.tri-table-rtl]="dir === 'rtl'"
        [class.tri-table-fixed-header]="data.length && scrollY"
        [class.tri-table-fixed-column]="scrollX"
        [class.tri-table-has-fix-left]="hasFixLeft"
        [class.tri-table-has-fix-right]="hasFixRight"
        [class.tri-table-bordered]="bordered"
        [class.nz-table-out-bordered]="outerBordered && !bordered"
        [class.tri-table-middle]="size === 'middle'"
        [class.tri-table-small]="size === 'small'"
      >
        @if (title) {
          <tri-table-title-footer [title]="title"></tri-table-title-footer>
        }
        @if (scrollY || scrollX) {
          <tri-table-inner-scroll
            [data]="data"
            [scrollX]="scrollX"
            [scrollY]="scrollY"
            [contentTemplate]="contentTemplate"
            [listOfColWidth]="listOfAutoColWidth"
            [theadTemplate]="theadTemplate"
            [tfootTemplate]="tfootTemplate"
            [tfootFixed]="tfootFixed"
            [verticalScrollBarWidth]="verticalScrollBarWidth"
            [virtualTemplate]="virtualScrollDirective ? virtualScrollDirective.templateRef : null"
            [virtualItemSize]="virtualItemSize"
            [virtualMaxBufferPx]="virtualMaxBufferPx"
            [virtualMinBufferPx]="virtualMinBufferPx"
            [tableMainElement]="tableMainElement"
            [virtualForTrackBy]="virtualForTrackBy"
            [noDataVirtualHeight]="noDataVirtualHeight"
          ></tri-table-inner-scroll>
        } @else {
          <tri-table-inner-default
            [tableLayout]="tableLayout"
            [listOfColWidth]="listOfManualColWidth"
            [theadTemplate]="theadTemplate"
            [contentTemplate]="contentTemplate"
            [tfootTemplate]="tfootTemplate"
          ></tri-table-inner-default>
        }
        @if (footer) {
          <tri-table-title-footer [footer]="footer"></tri-table-title-footer>
        }
      </div>
      @if (paginationPosition === 'both' || paginationPosition === 'bottom') {
        <ng-template [ngTemplateOutlet]="paginationTemplate"></ng-template>
      }
    </tri-spin>
    <ng-template #paginationTemplate>
      @if (showPagination && data.length) {
        <tri-pagination
          [hidden]="!showPagination"
          class="tri-table-pagination tri-table-pagination-right"
          [showSizeChanger]="showSizeChanger"
          [pageSizeOptions]="pageSizeOptions"
          [itemRender]="itemRender!"
          [showQuickJumper]="showQuickJumper"
          [hideOnSinglePage]="hideOnSinglePage"
          [showTotal]="showTotal"
          [size]="paginationType === 'small' ? 'small' : size === 'default' ? 'default' : 'small'"
          [pageSize]="pageSize"
          [total]="total"
          [simple]="simple"
          [pageIndex]="pageIndex"
          (pageSizeChange)="onPageSizeChange($event)"
          (pageIndexChange)="onPageIndexChange($event)"
        ></tri-pagination>
      }
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    class: 'tri-table-wrapper',
    '[class.tri-table-wrapper-rtl]': 'dir === "rtl"',
    '[class.tri-table-custom-column]': `customColumn.length`
  },
  imports: [
    TriSpinComponent,
    NgTemplateOutlet,
    TriTableTitleFooterComponent,
    TriTableInnerScrollComponent,
    TriTableInnerDefaultComponent,
    TriPaginationModule
  ]
})
export class TriTableComponent<T> implements OnInit, OnChanges, AfterViewInit {
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  private elementRef = inject(ElementRef);
  private resizeObserver = inject(TriResizeObserver);
  private cdr = inject(ChangeDetectorRef);
  private tableStyleService = inject(TriTableStyleService);
  private tableDataService = inject(TriTableDataService<T>);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @Input() tableLayout: TriTableLayout = 'auto';
  @Input() showTotal: TemplateRef<{ $implicit: number; range: [number, number] }> | null = null;
  @Input() itemRender: TemplateRef<PaginationItemRenderContext> | null = null;
  @Input() title: string | TemplateRef<TriSafeAny> | null = null;
  @Input() footer: string | TemplateRef<TriSafeAny> | null = null;
  @Input() noResult: string | TemplateRef<TriSafeAny> | undefined = undefined;
  @Input() pageSizeOptions = [10, 20, 30, 40, 50];
  @Input() virtualItemSize = 0;
  @Input() virtualMaxBufferPx = 200;
  @Input() virtualMinBufferPx = 100;
  @Input() virtualForTrackBy: TrackByFunction<T> = index => index;
  @Input() loadingDelay = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() total = 0;
  @Input() widthConfig: ReadonlyArray<string | null> = [];
  @Input() data: readonly T[] = [];
  @Input() customColumn: TriCustomColumn[] = [];

  @Input() paginationPosition: TriTablePaginationPosition = 'bottom';
  @Input() scroll: { x?: string | null; y?: string | null } = { x: null, y: null };
  @Input() noDataVirtualHeight = '182px';
  @Input() paginationType: TriTablePaginationType = 'default';
  @Input({ transform: booleanAttribute }) frontPagination = true;
  @Input({ transform: booleanAttribute }) templateMode = false;
  @Input({ transform: booleanAttribute }) showPagination = true;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input({ transform: booleanAttribute }) outerBordered = false;
  @Input() @WithConfig() loadingIndicator: TemplateRef<TriSafeAny> | null = null;
  @Input({ transform: booleanAttribute }) @WithConfig() bordered: boolean = false;
  @Input() @WithConfig() size: TriTableSize = 'default';
  @Input({ transform: booleanAttribute }) @WithConfig() showSizeChanger: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() hideOnSinglePage: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showQuickJumper: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() simple: boolean = false;
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly queryParams = new EventEmitter<TriTableQueryParams>();
  @Output() readonly currentPageDataChange = new EventEmitter<readonly T[]>();
  @Output() readonly customColumnChange = new EventEmitter<readonly TriCustomColumn[]>();

  /** public data for ngFor tr */
  public _data: readonly T[] = [];
  public cdkVirtualScrollViewport?: CdkVirtualScrollViewport;
  scrollX: string | null = null;
  scrollY: string | null = null;
  theadTemplate: TemplateRef<TriSafeAny> | null = null;
  tfootTemplate: TemplateRef<TriSafeAny> | null = null;
  tfootFixed: TriTableSummaryFixedType | null = null;
  listOfAutoColWidth: ReadonlyArray<string | null> = [];
  listOfManualColWidth: ReadonlyArray<string | null> = [];
  hasFixLeft = false;
  hasFixRight = false;
  _showPagination = true;
  private templateMode$ = new BehaviorSubject<boolean>(false);
  dir: Direction = 'ltr';
  @ContentChild(TriTableVirtualScrollDirective, { static: false })
  virtualScrollDirective!: TriTableVirtualScrollDirective<T>;
  @ViewChild(TriTableInnerScrollComponent) tableInnerScrollComponent!: TriTableInnerScrollComponent<T>;
  verticalScrollBarWidth = 0;
  onPageSizeChange(size: number): void {
    this.tableDataService.updatePageSize(size);
  }

  onPageIndexChange(index: number): void {
    this.tableDataService.updatePageIndex(index);
  }

  constructor() {
    onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  ngOnInit(): void {
    const { pageIndexDistinct$, pageSizeDistinct$, listOfCurrentPageData$, total$, queryParams$, listOfCustomColumn$ } =
      this.tableDataService;
    const { theadTemplate$, tfootTemplate$, tfootFixed$, hasFixLeft$, hasFixRight$ } = this.tableStyleService;

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    queryParams$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(this.queryParams);
    pageIndexDistinct$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pageIndex => {
      if (pageIndex !== this.pageIndex) {
        this.pageIndex = pageIndex;
        this.pageIndexChange.next(pageIndex);
      }
    });
    pageSizeDistinct$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(pageSize => {
      if (pageSize !== this.pageSize) {
        this.pageSize = pageSize;
        this.pageSizeChange.next(pageSize);
      }
    });
    total$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(total => this.frontPagination && total !== this.total)
      )
      .subscribe(total => {
        this.total = total;
        this.cdr.markForCheck();
      });
    listOfCurrentPageData$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this._data = data;
      this.currentPageDataChange.next(data);
      this.cdr.markForCheck();
    });

    listOfCustomColumn$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.customColumn = data;
      this.customColumnChange.next(data);
      this.cdr.markForCheck();
    });

    theadTemplate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(theadTemplate => {
      this.theadTemplate = theadTemplate;
      this.cdr.markForCheck();
    });

    combineLatest([tfootTemplate$, tfootFixed$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([tfootTemplate, tfootFixed]) => {
        this.tfootTemplate = tfootTemplate;
        this.tfootFixed = tfootFixed;
        this.cdr.markForCheck();
      });

    hasFixLeft$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(hasFixLeft => {
      this.hasFixLeft = hasFixLeft;
      this.cdr.markForCheck();
    });

    hasFixRight$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(hasFixRight => {
      this.hasFixRight = hasFixRight;
      this.cdr.markForCheck();
    });

    combineLatest([total$, this.templateMode$])
      .pipe(
        map(([total, templateMode]) => total === 0 && !templateMode),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(empty => {
        this.tableStyleService.setShowEmpty(empty);
      });

    this.verticalScrollBarWidth = measureScrollbar('vertical');
    this.tableStyleService.listOfListOfThWidthPx$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(listOfWidth => {
      this.listOfAutoColWidth = listOfWidth;
      this.cdr.markForCheck();
    });
    this.tableStyleService.manualWidthConfigPx$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(listOfWidth => {
      this.listOfManualColWidth = listOfWidth;
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      nzScroll,
      nzPageIndex,
      nzPageSize,
      nzFrontPagination,
      nzData,
      nzCustomColumn,
      nzWidthConfig,
      nzNoResult,
      nzTemplateMode
    } = changes;
    if (nzPageIndex) {
      this.tableDataService.updatePageIndex(this.pageIndex);
    }
    if (nzPageSize) {
      this.tableDataService.updatePageSize(this.pageSize);
    }
    if (nzData) {
      this.data = this.data || [];
      this.tableDataService.updateListOfData(this.data);
    }
    if (nzCustomColumn) {
      this.customColumn = this.customColumn || [];
      this.tableDataService.updateListOfCustomColumn(this.customColumn);
    }
    if (nzFrontPagination) {
      this.tableDataService.updateFrontPagination(this.frontPagination);
    }
    if (nzScroll) {
      this.setScrollOnChanges();
    }
    if (nzWidthConfig) {
      this.tableStyleService.setTableWidthConfig(this.widthConfig);
    }
    if (nzTemplateMode) {
      this.templateMode$.next(this.templateMode);
    }
    if (nzNoResult) {
      this.tableStyleService.setNoResult(this.noResult);
    }

    this.updateShowPagination();
  }

  ngAfterViewInit(): void {
    this.resizeObserver
      .observe(this.elementRef)
      .pipe(
        map(([entry]) => {
          const { width } = entry.target.getBoundingClientRect();
          const scrollBarWidth = this.scrollY ? this.verticalScrollBarWidth : 0;
          return Math.floor(width - scrollBarWidth);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(this.tableStyleService.hostWidth$);
    if (this.tableInnerScrollComponent && this.tableInnerScrollComponent.cdkVirtualScrollViewport) {
      this.cdkVirtualScrollViewport = this.tableInnerScrollComponent.cdkVirtualScrollViewport;
    }
  }

  private setScrollOnChanges(): void {
    this.scrollX = (this.scroll && this.scroll.x) || null;
    this.scrollY = (this.scroll && this.scroll.y) || null;
    this.tableStyleService.setScroll(this.scrollX, this.scrollY);
  }

  private updateShowPagination(): void {
    this._showPagination =
      (this.hideOnSinglePage && this.data.length > this.pageSize) ||
      (this.data.length > 0 && !this.hideOnSinglePage) ||
      (!this.frontPagination && this.total > this.pageSize);
  }
}
