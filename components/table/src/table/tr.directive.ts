/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AfterContentInit, ContentChildren, DestroyRef, Directive, QueryList, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, ReplaySubject, combineLatest, merge } from 'rxjs';
import { map, mergeMap, startWith, switchMap } from 'rxjs/operators';

import { TriCellFixedDirective } from '../cell/cell-fixed.directive';
import { TriThMeasureDirective } from '../cell/th-measure.directive';
import { TriTableStyleService } from '../table-style.service';

@Directive({
  selector: '',
  host: {
    '[class.tri-table-row]': 'isInsideTable'
  }
})
export class TriTrDirective implements AfterContentInit {
  private destroyRef = inject(DestroyRef);

  @ContentChildren(TriThMeasureDirective) listOfNzThDirective!: QueryList<TriThMeasureDirective>;
  @ContentChildren(TriCellFixedDirective) listOfCellFixedDirective!: QueryList<TriCellFixedDirective>;

  private listOfFixedColumns$ = new ReplaySubject<TriCellFixedDirective[]>(1);
  private listOfColumns$ = new ReplaySubject<TriThMeasureDirective[]>(1);
  listOfFixedColumnsChanges$: Observable<TriCellFixedDirective[]> = this.listOfFixedColumns$.pipe(
    switchMap(list =>
      merge(this.listOfFixedColumns$, ...list.map(c => c.changes$)).pipe(mergeMap(() => this.listOfFixedColumns$))
    ),
    takeUntilDestroyed(this.destroyRef)
  );
  listOfFixedLeftColumnChanges$ = this.listOfFixedColumnsChanges$.pipe(
    map(list => list.filter(item => item.left !== false))
  );
  listOfFixedRightColumnChanges$ = this.listOfFixedColumnsChanges$.pipe(
    map(list => list.filter(item => item.right !== false))
  );
  listOfColumnsChanges$: Observable<TriThMeasureDirective[]> = this.listOfColumns$.pipe(
    switchMap(list =>
      merge(this.listOfColumns$, ...list.map(c => c.changes$)).pipe(mergeMap(() => this.listOfColumns$))
    ),
    takeUntilDestroyed(this.destroyRef)
  );

  private tableStyleService = inject(TriTableStyleService, { optional: true });
  isInsideTable = !!this.tableStyleService;

  ngAfterContentInit(): void {
    if (this.tableStyleService) {
      this.listOfCellFixedDirective.changes
        .pipe(startWith(this.listOfCellFixedDirective), takeUntilDestroyed(this.destroyRef))
        .subscribe(this.listOfFixedColumns$);
      this.listOfNzThDirective.changes
        .pipe(startWith(this.listOfNzThDirective), takeUntilDestroyed(this.destroyRef))
        .subscribe(this.listOfColumns$);
      /** set last left and first right **/
      this.listOfFixedLeftColumnChanges$.subscribe(listOfFixedLeft => {
        listOfFixedLeft.forEach(cell => cell.setIsLastLeft(cell === listOfFixedLeft[listOfFixedLeft.length - 1]));
      });
      this.listOfFixedRightColumnChanges$.subscribe(listOfFixedRight => {
        listOfFixedRight.forEach(cell => cell.setIsFirstRight(cell === listOfFixedRight[0]));
      });
      /** calculate fixed nzLeft and nzRight **/
      combineLatest([this.tableStyleService.listOfListOfThWidth$, this.listOfFixedLeftColumnChanges$])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([listOfAutoWidth, listOfLeftCell]) => {
          listOfLeftCell.forEach((cell, index) => {
            if (cell.isAutoLeft) {
              const currentArray = listOfLeftCell.slice(0, index);
              const count = currentArray.reduce((pre, cur) => pre + (cur.colspan || cur.colSpan || 1), 0);
              const width = listOfAutoWidth.slice(0, count).reduce((pre, cur) => pre + cur, 0);
              cell.setAutoLeftWidth(`${width}px`);
            }
          });
        });
      combineLatest([this.tableStyleService.listOfListOfThWidth$, this.listOfFixedRightColumnChanges$])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([listOfAutoWidth, listOfRightCell]) => {
          listOfRightCell.forEach((_, index) => {
            const cell = listOfRightCell[listOfRightCell.length - index - 1];
            if (cell.isAutoRight) {
              const currentArray = listOfRightCell.slice(listOfRightCell.length - index, listOfRightCell.length);
              const count = currentArray.reduce((pre, cur) => pre + (cur.colspan || cur.colSpan || 1), 0);
              const width = listOfAutoWidth
                .slice(listOfAutoWidth.length - count, listOfAutoWidth.length)
                .reduce((pre, cur) => pre + cur, 0);
              cell.setAutoRightWidth(`${width}px`);
            }
          });
        });
    }
  }
}
