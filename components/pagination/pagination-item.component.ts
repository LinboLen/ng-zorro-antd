/* eslint-disable */
/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriPaginationI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { PaginationItemRenderContext, PaginationItemType } from './pagination.types';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #renderItemTemplate let-type let-page="page">
      @switch (type) {
        @case ('page') {
          <a>{{ page }}</a>
        }
        @case ('prev') {
          <button type="button" [disabled]="disabled" [attr.title]="locale.prev_page" class="tri-pagination-item-link">
            @if (direction === 'rtl') {
              <tri-icon type="right" />
            } @else {
              <tri-icon type="left" />
            }
          </button>
        }
        @case ('next') {
          <button type="button" [disabled]="disabled" [attr.title]="locale.next_page" class="tri-pagination-item-link">
            @if (direction === 'rtl') {
              <tri-icon type="left" />
            } @else {
              <tri-icon type="right" />
            }
          </button>
        }
        @default {
          <a class="tri-pagination-item-link">
            <div class="tri-pagination-item-container">
              @switch (type) {
                @case ('prev_5') {
                  @if (direction === 'rtl') {
                    <tri-icon type="double-right" class="tri-pagination-item-link-icon" />
                  } @else {
                    <tri-icon type="double-left" class="tri-pagination-item-link-icon" />
                  }
                }
                @case ('next_5') {
                  @if (direction === 'rtl') {
                    <tri-icon type="double-left" class="tri-pagination-item-link-icon" />
                  } @else {
                    <tri-icon type="double-right" class="tri-pagination-item-link-icon" />
                  }
                }
              }
              <span class="tri-pagination-item-ellipsis">•••</span>
            </div>
          </a>
        }
      }
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="itemRender || renderItemTemplate"
      [ngTemplateOutletContext]="{ $implicit: type, page: index }"
    />
  `,
  host: {
    '[class.tri-pagination-prev]': `type === 'prev'`,
    '[class.tri-pagination-next]': `type === 'next'`,
    '[class.tri-pagination-item]': `type === 'page'`,
    '[class.tri-pagination-jump-prev]': `type === 'prev_5'`,
    '[class.tri-pagination-jump-prev-custom-icon]': `type === 'prev_5'`,
    '[class.tri-pagination-jump-next]': `type === 'next_5'`,
    '[class.tri-pagination-jump-next-custom-icon]': `type === 'next_5'`,
    '[class.tri-pagination-disabled]': 'disabled',
    '[class.tri-pagination-item-active]': 'active',
    '[attr.title]': 'title',
    '(click)': 'clickItem()'
  },
  imports: [TriIconModule, NgTemplateOutlet]
})
export class TriPaginationItemComponent implements OnChanges {
  @Input() active = false;
  @Input() locale!: TriPaginationI18nInterface;
  @Input() index: number | null | undefined = null;
  @Input() disabled = false;
  @Input() direction = 'ltr';
  @Input() type: PaginationItemType | string | null | undefined = null;
  @Input() itemRender: TemplateRef<PaginationItemRenderContext> | null = null;
  @Output() readonly diffIndex = new EventEmitter<number>();
  @Output() readonly gotoIndex = new EventEmitter<number>();
  title: string | null = null;

  clickItem(): void {
    if (!this.disabled) {
      if (this.type === 'page') {
        this.gotoIndex.emit(this.index!);
      } else {
        this.diffIndex.emit(
          (
            {
              next: 1,
              prev: -1,
              prev_5: -5,
              next_5: 5
            } as TriSafeAny
          )[this.type!]
        );
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { locale, index, type } = changes;
    if (locale || index || type) {
      this.title = (
        {
          page: `${this.index}`,
          next: this.locale?.next_page,
          prev: this.locale?.prev_page,
          prev_5: this.locale?.prev_5,
          next_5: this.locale?.next_5
        } as TriSafeAny
      )[this.type!];
    }
  }
}
