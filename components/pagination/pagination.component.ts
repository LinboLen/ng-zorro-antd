/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  numberAttribute,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject } from 'rxjs';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzBreakpointEnum, TriBreakpointService, gridResponsiveMap } from 'ng-zorro-antd/core/services';
import { TriI18nService, TriPaginationI18nInterface } from 'ng-zorro-antd/i18n';

import { TriPaginationDefaultComponent } from './pagination-default.component';
import { TriPaginationSimpleComponent } from './pagination-simple.component';
import { PaginationItemRenderContext } from './pagination.types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'pagination';

@Component({
  selector: '',
  exportAs: 'triPagination',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showPagination) {
      @if (simple) {
        <ng-template [ngTemplateOutlet]="simplePagination.template" />
      } @else {
        <ng-template [ngTemplateOutlet]="defaultPagination.template" />
      }
    }

    <tri-pagination-simple
      #simplePagination
      [disabled]="disabled"
      [itemRender]="itemRender"
      [locale]="locale"
      [pageSize]="pageSize"
      [total]="total"
      [pageIndex]="pageIndex"
      (pageIndexChange)="onPageIndexChange($event)"
    ></tri-pagination-simple>
    <tri-pagination-default
      #defaultPagination
      [size]="size"
      [itemRender]="itemRender"
      [showTotal]="showTotal"
      [disabled]="disabled"
      [locale]="locale"
      [showSizeChanger]="showSizeChanger"
      [showQuickJumper]="showQuickJumper"
      [total]="total"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      (pageIndexChange)="onPageIndexChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
    ></tri-pagination-default>
  `,
  host: {
    class: 'tri-pagination',
    '[class.tri-pagination-simple]': 'simple',
    '[class.tri-pagination-disabled]': 'disabled',
    '[class.tri-pagination-mini]': `!simple && size === 'small'`,
    '[class.tri-pagination-rtl]': `dir === 'rtl'`
  },
  imports: [NgTemplateOutlet, TriPaginationSimpleComponent, TriPaginationDefaultComponent]
})
export class TriPaginationComponent implements OnInit, OnChanges {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  private readonly i18n = inject(TriI18nService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly breakpointService = inject(TriBreakpointService);
  protected readonly configService = inject(TriConfigService);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @Output() readonly pageSizeChange = new EventEmitter<number>();
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Input() showTotal: TemplateRef<{ $implicit: number; range: [number, number] }> | null = null;
  @Input() itemRender: TemplateRef<PaginationItemRenderContext> | null = null;
  @Input() @WithConfig() size: 'default' | 'small' = 'default';
  @Input() @WithConfig() pageSizeOptions: number[] = [10, 20, 30, 40];
  @Input({ transform: booleanAttribute }) @WithConfig() showSizeChanger = false;
  @Input({ transform: booleanAttribute }) @WithConfig() showQuickJumper = false;
  @Input({ transform: booleanAttribute }) @WithConfig() simple = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) responsive = false;
  @Input({ transform: booleanAttribute }) hideOnSinglePage = false;
  @Input({ transform: numberAttribute }) total = 0;
  @Input({ transform: numberAttribute }) pageIndex = 1;
  @Input({ transform: numberAttribute }) pageSize = 10;

  showPagination = true;
  locale!: TriPaginationI18nInterface;
  _size: 'default' | 'small' = 'default';
  dir: Direction = 'ltr';

  private total$ = new ReplaySubject<number>(1);

  validatePageIndex(value: number, lastIndex: number): number {
    if (value > lastIndex) {
      return lastIndex;
    } else if (value < 1) {
      return 1;
    } else {
      return value;
    }
  }

  onPageIndexChange(index: number): void {
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    const validIndex = this.validatePageIndex(index, lastIndex);
    if (validIndex !== this.pageIndex && !this.disabled) {
      this.pageIndex = validIndex;
      this.pageIndexChange.emit(this.pageIndex);
    }
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageSizeChange.emit(size);
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    if (this.pageIndex > lastIndex) {
      this.onPageIndexChange(lastIndex);
    }
  }

  onTotalChange(total: number): void {
    const lastIndex = this.getLastIndex(total, this.pageSize);
    if (this.pageIndex > lastIndex) {
      Promise.resolve().then(() => {
        this.onPageIndexChange(lastIndex);
        this.cdr.markForCheck();
      });
    }
  }

  getLastIndex(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Pagination');
      this.cdr.markForCheck();
    });

    this.total$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(total => {
      this.onTotalChange(total);
    });

    this.breakpointService
      .subscribe(gridResponsiveMap)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(bp => {
        if (this.responsive) {
          this._size = bp === NzBreakpointEnum.xs ? 'small' : 'default';
          this.cdr.markForCheck();
        }
      });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzHideOnSinglePage, nzTotal, nzPageSize, nzSize } = changes;
    if (nzTotal) {
      this.total$.next(this.total);
    }
    if (nzHideOnSinglePage || nzTotal || nzPageSize) {
      this.showPagination =
        (this.hideOnSinglePage && this.total > this.pageSize) || (this.total > 0 && !this.hideOnSinglePage);
    }

    if (nzSize) {
      this._size = nzSize.currentValue;
    }
  }
}
