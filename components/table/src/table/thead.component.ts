/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/* eslint-disable @angular-eslint/component-selector */
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, merge, of } from 'rxjs';
import { delay, map, mergeMap, startWith, switchMap } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriThAddOnComponent } from '../cell/th-addon.component';
import { TriTableDataService } from '../table-data.service';
import { TriTableStyleService } from '../table-style.service';
import { TriTrDirective } from './tr.directive';

@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #contentTemplate>
      <ng-content />
    </ng-template>
    @if (!isInsideTable) {
      <ng-template [ngTemplateOutlet]="contentTemplate" />
    }
  `,
  imports: [NgTemplateOutlet]
})
export class TriTheadComponent<T> implements AfterContentInit, AfterViewInit, OnInit {
  private tableStyleService = inject(TriTableStyleService, { optional: true });
  private tableDataService: TriTableDataService<T> | null = inject(TriTableDataService, { optional: true });
  private destroyRef = inject(DestroyRef);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private renderer = inject(Renderer2);

  isInsideTable = !!this.tableStyleService;
  @ViewChild('contentTemplate', { static: true }) templateRef!: TemplateRef<TriSafeAny>;
  @ContentChildren(TriTrDirective, { descendants: true }) listOfNzTrDirective!: QueryList<TriTrDirective>;
  @ContentChildren(TriThAddOnComponent, { descendants: true }) listOfNzThAddOnComponent!: QueryList<
    TriThAddOnComponent<T>
  >;
  @Output() readonly sortOrderChange = new EventEmitter<{ key: TriSafeAny; value: string | null }>();

  ngOnInit(): void {
    if (this.tableStyleService) {
      this.tableStyleService.setTheadTemplate(this.templateRef);
    }
  }

  ngAfterContentInit(): void {
    if (this.tableStyleService) {
      const firstTableRow$ = this.listOfNzTrDirective.changes.pipe(
        startWith(this.listOfNzTrDirective),
        map(item => item && item.first),
        takeUntilDestroyed(this.destroyRef)
      ) as Observable<TriTrDirective>;
      const listOfColumnsChanges$ = firstTableRow$.pipe(
        switchMap(firstTableRow => (firstTableRow ? firstTableRow.listOfColumnsChanges$ : EMPTY))
      );
      listOfColumnsChanges$.subscribe(data => this.tableStyleService!.setListOfTh(data));
      /** TODO: need reset the measure row when scrollX change **/
      this.tableStyleService.enableAutoMeasure$
        .pipe(switchMap(enable => (enable ? listOfColumnsChanges$ : of([]))))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(data => this.tableStyleService!.setListOfMeasureColumn(data));
      const listOfFixedLeftColumnChanges$ = firstTableRow$.pipe(
        switchMap(firstTr => (firstTr ? firstTr.listOfFixedLeftColumnChanges$ : EMPTY))
      );
      const listOfFixedRightColumnChanges$ = firstTableRow$.pipe(
        switchMap(firstTr => (firstTr ? firstTr.listOfFixedRightColumnChanges$ : EMPTY))
      );
      listOfFixedLeftColumnChanges$.subscribe(listOfFixedLeftColumn => {
        this.tableStyleService!.setHasFixLeft(listOfFixedLeftColumn.length !== 0);
      });
      listOfFixedRightColumnChanges$.subscribe(listOfFixedRightColumn => {
        this.tableStyleService!.setHasFixRight(listOfFixedRightColumn.length !== 0);
      });
    }

    if (this.tableDataService) {
      const listOfColumn$ = this.listOfNzThAddOnComponent.changes.pipe(
        startWith(this.listOfNzThAddOnComponent)
      ) as Observable<QueryList<TriThAddOnComponent<T>>>;
      const manualSort$ = listOfColumn$.pipe(
        switchMap(() => merge(...this.listOfNzThAddOnComponent.map(th => th.manualClickOrder$))),
        takeUntilDestroyed(this.destroyRef)
      );
      manualSort$.subscribe(data => {
        const emitValue = { key: data.columnKey, value: data._sortOrder };
        this.sortOrderChange.emit(emitValue);
        if (data.sortFn && data.sortPriority === false) {
          this.listOfNzThAddOnComponent.filter(th => th !== data).forEach(th => th.clearSortOrder());
        }
      });
      const listOfCalcOperator$ = listOfColumn$.pipe(
        switchMap(list =>
          merge(listOfColumn$, ...list.map(c => c.calcOperatorChange$)).pipe(mergeMap(() => listOfColumn$))
        ),
        map(list =>
          list
            .filter(item => !!item.sortFn || !!item.filterFn)
            .map(item => {
              const { sortFn, _sortOrder, filterFn, filterValue, sortPriority, columnKey } = item;
              return {
                key: columnKey,
                sortFn: sortFn,
                sortPriority: sortPriority,
                sortOrder: _sortOrder!,
                filterFn: filterFn!,
                filterValue: filterValue
              };
            })
        ),
        // TODO: after checked error here
        delay(0),
        takeUntilDestroyed(this.destroyRef)
      );
      listOfCalcOperator$.subscribe(list => {
        this.tableDataService?.listOfCalcOperator$.next(list);
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.tableStyleService) {
      this.renderer.removeChild(this.renderer.parentNode(this.el), this.el);
    }
  }
}
