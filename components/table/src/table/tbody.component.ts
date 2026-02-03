/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/* eslint-disable @angular-eslint/component-selector */

import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriEmptyModule } from 'ng-zorro-antd/empty';

import { TriTableStyleService } from '../table-style.service';
import { TriTableFixedRowComponent } from './table-fixed-row.component';
import { TriTrMeasureComponent } from './tr-measure.component';

@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (listOfMeasureColumn$ | async; as listOfMeasureColumn) {
      @if (isInsideTable && listOfMeasureColumn.length) {
        <tr
          tri-table-measure-row
          [listOfMeasureColumn]="listOfMeasureColumn"
          (listOfAutoWidth)="onListOfAutoWidthChange($event)"
        ></tr>
      }
    }
    <ng-content />
    @if (showEmpty$ | async) {
      <tr class="tri-table-placeholder" tri-table-fixed-row>
        <tri-embed-empty componentName="table" [specificContent]="(noResult$ | async)!" />
      </tr>
    }
  `,
  host: {
    '[class.tri-table-tbody]': 'isInsideTable'
  },
  imports: [AsyncPipe, TriTrMeasureComponent, TriTableFixedRowComponent, TriEmptyModule]
})
export class TriTbodyComponent {
  showEmpty$ = new BehaviorSubject<boolean>(false);
  noResult$ = new BehaviorSubject<string | TemplateRef<TriSafeAny> | undefined>(undefined);
  listOfMeasureColumn$ = new BehaviorSubject<readonly string[]>([]);
  private tableStyleService = inject(TriTableStyleService, { optional: true });
  isInsideTable = !!this.tableStyleService;

  constructor() {
    if (this.tableStyleService) {
      const { showEmpty$, noResult$, listOfMeasureColumn$ } = this.tableStyleService;
      noResult$.pipe(takeUntilDestroyed()).subscribe(this.noResult$);
      listOfMeasureColumn$.pipe(takeUntilDestroyed()).subscribe(this.listOfMeasureColumn$);
      showEmpty$.pipe(takeUntilDestroyed()).subscribe(this.showEmpty$);
    }
  }

  onListOfAutoWidthChange(listOfAutoWidth: number[]): void {
    this.tableStyleService?.setListOfAutoWidth(listOfAutoWidth);
  }
}
