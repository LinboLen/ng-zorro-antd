/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriDirectionVHType, TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriSpinModule } from 'ng-zorro-antd/spin';

import { TriListGrid } from './interface';
import {
  TriListEmptyComponent,
  TriListFooterComponent,
  TriListHeaderComponent,
  TriListLoadMoreDirective,
  TriListPaginationComponent
} from './list-cell';

@Component({
  selector: 'tri-list,[tri-list]',
  exportAs: 'triList',
  template: `
    @if (header) {
      <tri-list-header>
        <ng-container *stringTemplateOutlet="header">{{ header }}</ng-container>
      </tri-list-header>
    }

    <ng-content select="nz-list-header" />

    <tri-spin [spinning]="loading">
      <ng-container>
        @if (loading && dataSource && dataSource.length === 0) {
          <div [style.min-height.px]="53"></div>
        }
        @if (grid && dataSource) {
          <div tri-row [gutter]="grid.gutter || null">
            @for (item of dataSource; track item; let index = $index) {
              <div
                tri-col
                [span]="grid.span || null"
                [xs]="grid.xs || null"
                [sm]="grid.sm || null"
                [md]="grid.md || null"
                [lg]="grid.lg || null"
                [xl]="grid.xl || null"
                [xXl]="grid.xxl || null"
              >
                <ng-template
                  [ngTemplateOutlet]="renderItem"
                  [ngTemplateOutletContext]="{ $implicit: item, index: index }"
                />
              </div>
            }
          </div>
        } @else {
          <div class="tri-list-items">
            @for (item of dataSource; track item; let index = $index) {
              <ng-container>
                <ng-template
                  [ngTemplateOutlet]="renderItem"
                  [ngTemplateOutletContext]="{ $implicit: item, index: index }"
                />
              </ng-container>
            }
            <ng-content />
          </div>
        }

        @if (!loading && dataSource && dataSource.length === 0) {
          <tri-list-empty [noResult]="noResult" />
        }
      </ng-container>
    </tri-spin>

    @if (footer) {
      <tri-list-footer>
        <ng-container *stringTemplateOutlet="footer">{{ footer }}</ng-container>
      </tri-list-footer>
    }

    <ng-content select="nz-list-footer, [nz-list-footer]" />

    <ng-template [ngTemplateOutlet]="loadMore"></ng-template>
    <ng-content select="nz-list-load-more, [nz-list-load-more]" />

    @if (pagination) {
      <tri-list-pagination>
        <ng-template [ngTemplateOutlet]="pagination" />
      </tri-list-pagination>
    }

    <ng-content select="nz-list-pagination, [nz-list-pagination]" />
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-list',
    '[class.tri-list-rtl]': `dir === 'rtl'`,
    '[class.tri-list-vertical]': 'itemLayout === "vertical"',
    '[class.tri-list-lg]': 'size === "large"',
    '[class.tri-list-sm]': 'size === "small"',
    '[class.tri-list-split]': 'split',
    '[class.tri-list-bordered]': 'bordered',
    '[class.tri-list-loading]': 'loading',
    '[class.tri-list-something-after-last-item]': 'hasSomethingAfterLastItem'
  },
  imports: [
    NgTemplateOutlet,
    TriListHeaderComponent,
    TriOutletModule,
    TriSpinModule,
    TriGridModule,
    TriListEmptyComponent,
    TriListFooterComponent,
    TriListPaginationComponent
  ]
})
export class TriListComponent implements AfterContentInit, OnChanges, OnInit {
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @Input() dataSource?: TriSafeAny[];
  @Input({ transform: booleanAttribute }) bordered = false;
  @Input() grid?: TriListGrid | '' | null | undefined = '';
  @Input() header?: string | TemplateRef<void>;
  @Input() footer?: string | TemplateRef<void>;
  @Input() itemLayout: TriDirectionVHType = 'horizontal';
  @Input() renderItem: TemplateRef<{ $implicit: TriSafeAny; index: number }> | null = null;
  @Input({ transform: booleanAttribute }) loading = false;
  @Input() loadMore: TemplateRef<void> | null = null;
  @Input() pagination?: TemplateRef<void>;
  @Input() size: TriSizeLDSType = 'default';
  @Input({ transform: booleanAttribute }) split = true;
  @Input() noResult?: string | TemplateRef<void>;

  @ContentChild(TriListFooterComponent) listFooterComponent!: TriListFooterComponent;
  @ContentChild(TriListPaginationComponent) listPaginationComponent!: TriListPaginationComponent;
  @ContentChild(TriListLoadMoreDirective) listLoadMoreDirective!: TriListLoadMoreDirective;

  hasSomethingAfterLastItem = false;
  dir: Direction = 'ltr';
  private itemLayoutNotifySource = new BehaviorSubject<TriDirectionVHType>(this.itemLayout);

  get itemLayoutNotify$(): Observable<TriDirectionVHType> {
    return this.itemLayoutNotifySource.asObservable();
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.itemLayoutNotifySource.unsubscribe());
  }

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  getSomethingAfterLastItem(): boolean {
    return !!(
      this.loadMore ||
      this.pagination ||
      this.footer ||
      this.listFooterComponent ||
      this.listPaginationComponent ||
      this.listLoadMoreDirective
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzItemLayout) {
      this.itemLayoutNotifySource.next(this.itemLayout);
    }
  }

  ngAfterContentInit(): void {
    this.hasSomethingAfterLastItem = this.getSomethingAfterLastItem();
  }
}
