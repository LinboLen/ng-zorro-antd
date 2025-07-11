/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/* eslint-disable @angular-eslint/component-selector */
import { NgTemplateOutlet } from '@angular/common';
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
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriTableFilterComponent } from '../addon/filter.component';
import { TriTableSortersComponent } from '../addon/sorters.component';
import {
  TriTableFilterFn,
  TriTableFilterList,
  TriTableFilterValue,
  TriTableSortFn,
  TriTableSortOrder
} from '../table.types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'table';

@Component({
  selector:
    'th[nzColumnKey],th[nzSortFn],th[nzSortOrder],th[nzFilters],th[nzShowSort],th[nzShowFilter],th[nzCustomFilter]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showFilter || customFilter) {
      <tri-table-filter
        [contentTemplate]="notFilterTemplate"
        [extraTemplate]="extraTemplate"
        [customFilter]="customFilter"
        [filterMultiple]="filterMultiple"
        [listOfFilter]="filters"
        (filterChange)="onFilterValueChange($event)"
      ></tri-table-filter>
    } @else {
      <ng-container [ngTemplateOutlet]="notFilterTemplate"></ng-container>
    }
    <ng-template #notFilterTemplate>
      <ng-template [ngTemplateOutlet]="showSort ? sortTemplate : contentTemplate"></ng-template>
    </ng-template>
    <ng-template #extraTemplate>
      <ng-content select="[nz-th-extra]"></ng-content>
      <ng-content select="nz-filter-trigger"></ng-content>
    </ng-template>
    <ng-template #sortTemplate>
      <tri-table-sorters
        [sortOrder]="sortOrder"
        [sortDirections]="sortDirections"
        [contentTemplate]="contentTemplate"
      ></tri-table-sorters>
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.tri-table-column-has-sorters]': 'showSort',
    '[class.tri-table-column-sort]': `sortOrder === 'descend' || sortOrder === 'ascend'`
  },
  imports: [TriTableFilterComponent, NgTemplateOutlet, TriTableSortersComponent]
})
export class TriThAddOnComponent<T> implements OnChanges, OnInit {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  configService = inject(TriConfigService);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  manualClickOrder$ = new Subject<TriThAddOnComponent<T>>();
  calcOperatorChange$ = new Subject<void>();
  filterValue: TriTableFilterValue = null;
  _sortOrder: TriTableSortOrder = null;
  _sortDirections: TriTableSortOrder[] = ['ascend', 'descend', null];
  private sortOrderChange$ = new Subject<TriTableSortOrder>();
  private isNzShowSortChanged = false;
  private isNzShowFilterChanged = false;
  @Input() columnKey?: string;
  @Input() filterMultiple = true;
  @Input() sortOrder: TriTableSortOrder = null;
  @Input() sortPriority: number | boolean = false;
  @Input() @WithConfig() sortDirections: TriTableSortOrder[] = ['ascend', 'descend', null];
  @Input() filters: TriTableFilterList = [];
  @Input() sortFn: TriTableSortFn<T> | boolean | null = null;
  @Input() filterFn: TriTableFilterFn<T> | boolean | null = null;
  @Input({ transform: booleanAttribute }) showSort = false;
  @Input({ transform: booleanAttribute }) showFilter = false;
  @Input({ transform: booleanAttribute }) customFilter = false;
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Output() readonly sortOrderChange = new EventEmitter<string | null>();
  @Output() readonly filterChange = new EventEmitter<TriTableFilterValue>();

  getNextSortDirection(sortDirections: TriTableSortOrder[], current: TriTableSortOrder): TriTableSortOrder {
    const index = sortDirections.indexOf(current);
    if (index === sortDirections.length - 1) {
      return sortDirections[0];
    } else {
      return sortDirections[index + 1];
    }
  }

  setSortOrder(order: TriTableSortOrder): void {
    this.sortOrderChange$.next(order);
  }

  clearSortOrder(): void {
    if (this._sortOrder !== null) {
      this.setSortOrder(null);
    }
  }

  onFilterValueChange(value: TriTableFilterValue): void {
    this.filterChange.emit(value);
    this.filterValue = value;
    this.updateCalcOperator();
  }

  updateCalcOperator(): void {
    this.calcOperatorChange$.next();
  }

  ngOnInit(): void {
    fromEventOutsideAngular(this.el, 'click')
      .pipe(
        filter(() => this.showSort),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const nextOrder = this.getNextSortDirection(this._sortDirections, this._sortOrder!);
        this.ngZone.run(() => {
          this.setSortOrder(nextOrder);
          this.manualClickOrder$.next(this);
        });
      });

    this.sortOrderChange$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(order => {
      if (this._sortOrder !== order) {
        this._sortOrder = order;
        this.sortOrderChange.emit(order);
      }
      this.updateCalcOperator();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const {
      nzSortDirections,
      nzFilters,
      nzSortOrder,
      nzSortFn,
      nzFilterFn,
      nzSortPriority,
      nzFilterMultiple,
      nzShowSort,
      nzShowFilter
    } = changes;
    if (nzSortDirections) {
      if (this.sortDirections && this.sortDirections.length) {
        this._sortDirections = this.sortDirections;
      }
    }
    if (nzSortOrder) {
      this._sortOrder = this.sortOrder;
      this.setSortOrder(this.sortOrder);
    }
    if (nzShowSort) {
      this.isNzShowSortChanged = true;
    }
    if (nzShowFilter) {
      this.isNzShowFilterChanged = true;
    }
    const isFirstChange = (value: SimpleChange): boolean =>
      value && value.firstChange && value.currentValue !== undefined;
    if ((isFirstChange(nzSortOrder) || isFirstChange(nzSortFn)) && !this.isNzShowSortChanged) {
      this.showSort = true;
    }
    if (isFirstChange(nzFilters) && !this.isNzShowFilterChanged) {
      this.showFilter = true;
    }
    if ((nzFilters || nzFilterMultiple) && this.showFilter) {
      const listOfValue = this.filters.filter(item => item.byDefault).map(item => item.value);
      this.filterValue = this.filterMultiple ? listOfValue : listOfValue[0] || null;
    }
    if (nzSortFn || nzFilterFn || nzSortPriority || nzFilters) {
      this.updateCalcOperator();
    }
  }
}
