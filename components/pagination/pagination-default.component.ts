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
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriPaginationI18nInterface } from 'ng-zorro-antd/i18n';

import { TriPaginationItemComponent } from './pagination-item.component';
import { TriPaginationOptionsComponent } from './pagination-options.component';
import { PaginationItemRenderContext } from './pagination.types';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #containerTemplate>
      <ul>
        @if (showTotal) {
          <li class="tri-pagination-total-text">
            <ng-template
              [ngTemplateOutlet]="showTotal"
              [ngTemplateOutletContext]="{ $implicit: total, range: ranges }"
            />
          </li>
        }

        @for (page of listOfPageItem; track trackByPageItem($index, page)) {
          <li
            tri-pagination-item
            [locale]="locale"
            [type]="page.type"
            [index]="page.index"
            [disabled]="!!page.disabled"
            [itemRender]="itemRender"
            [active]="pageIndex === page.index"
            (gotoIndex)="jumpPage($event)"
            (diffIndex)="jumpDiff($event)"
            [direction]="dir"
          ></li>
        }

        @if (showQuickJumper || showSizeChanger) {
          <li
            tri-pagination-options
            [total]="total"
            [locale]="locale"
            [disabled]="disabled"
            [size]="size"
            [showSizeChanger]="showSizeChanger"
            [showQuickJumper]="showQuickJumper"
            [pageIndex]="pageIndex"
            [pageSize]="pageSize"
            [pageSizeOptions]="pageSizeOptions"
            (pageIndexChange)="onPageIndexChange($event)"
            (pageSizeChange)="onPageSizeChange($event)"
          ></li>
        }
      </ul>
    </ng-template>
  `,
  imports: [NgTemplateOutlet, TriPaginationItemComponent, TriPaginationOptionsComponent],
  host: {
    '[class.tri-pagination-rtl]': "dir === 'rtl'"
  }
})
export class TriPaginationDefaultComponent implements OnChanges, OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('containerTemplate', { static: true }) template!: TemplateRef<TriSafeAny>;
  @Input() size: 'default' | 'small' = 'default';
  @Input() itemRender: TemplateRef<PaginationItemRenderContext> | null = null;
  @Input() showTotal: TemplateRef<{ $implicit: number; range: [number, number] }> | null = null;
  @Input() disabled = false;
  @Input() locale!: TriPaginationI18nInterface;
  @Input() showSizeChanger = false;
  @Input() showQuickJumper = false;
  @Input() total = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 20, 30, 40];
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  ranges = [0, 0];
  listOfPageItem: Array<Partial<TriPaginationItemComponent>> = [];

  dir: Direction = 'ltr';

  constructor() {
    const el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
    const renderer = inject(Renderer2);
    renderer.removeChild(renderer.parentNode(el), el);
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
    this.dir = this.directionality.value;
  }

  jumpPage(index: number): void {
    this.onPageIndexChange(index);
  }

  jumpDiff(diff: number): void {
    this.jumpPage(this.pageIndex + diff);
  }

  trackByPageItem(_: number, value: Partial<TriPaginationItemComponent>): string {
    return `${value.type}-${value.index}`;
  }

  onPageIndexChange(index: number): void {
    this.pageIndexChange.next(index);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.next(size);
  }

  getLastIndex(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  buildIndexes(): void {
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    this.listOfPageItem = this.getListOfPageItem(this.pageIndex, lastIndex);
  }

  getListOfPageItem(pageIndex: number, lastIndex: number): Array<Partial<TriPaginationItemComponent>> {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const concatWithPrevNext = (listOfPage: Array<Partial<TriPaginationItemComponent>>) => {
      const prevItem = {
        type: 'prev',
        disabled: pageIndex === 1
      };
      const nextItem = {
        type: 'next',
        disabled: pageIndex === lastIndex
      };
      return [prevItem, ...listOfPage, nextItem];
    };
    const generatePage = (start: number, end: number): Array<Partial<TriPaginationItemComponent>> => {
      const list = [];
      for (let i = start; i <= end; i++) {
        list.push({ index: i, type: 'page' });
      }
      return list;
    };
    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange = [];
        const prevFiveItem = {
          type: 'prev_5'
        };
        const nextFiveItem = {
          type: 'next_5'
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 5) {
          // If the 4th is selected, one more page will be displayed.
          const maxLeft = selected === 4 ? 6 : 5;
          listOfRange = [...generatePage(2, maxLeft), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 2, selected + 2), nextFiveItem];
        } else {
          // If the 4th from last is selected, one more page will be displayed.
          const minRight = selected === last - 3 ? last - 5 : last - 4;
          listOfRange = [prevFiveItem, ...generatePage(minRight, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pageIndex, pageSize, total } = changes;
    if (pageIndex || pageSize || total) {
      this.ranges = [(this.pageIndex - 1) * this.pageSize + 1, Math.min(this.pageIndex * this.pageSize, this.total)];
      this.buildIndexes();
    }
  }
}
