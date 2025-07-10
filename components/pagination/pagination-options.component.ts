/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { toNumber } from 'ng-zorro-antd/core/util';
import { TriPaginationI18nInterface } from 'ng-zorro-antd/i18n';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showSizeChanger) {
      <tri-select
        class="tri-pagination-options-size-changer"
        [disabled]="disabled"
        [size]="size"
        [ngModel]="pageSize"
        (ngModelChange)="onPageSizeChange($event)"
      >
        @for (option of listOfPageSizeOption; track option.value) {
          <tri-option [label]="option.label" [value]="option.value" />
        }
      </tri-select>
    }

    @if (showQuickJumper) {
      <div class="tri-pagination-options-quick-jumper">
        {{ locale.jump_to }}
        <input [disabled]="disabled" (keydown.enter)="jumpToPageViaInput($event)" />
        {{ locale.page }}
      </div>
    }
  `,
  host: { class: 'tri-pagination-options' },
  imports: [TriSelectModule, FormsModule]
})
export class TriPaginationOptionsComponent implements OnChanges {
  @Input() size: 'default' | 'small' = 'default';
  @Input() disabled = false;
  @Input() showSizeChanger = false;
  @Input() showQuickJumper = false;
  @Input() locale!: TriPaginationI18nInterface;
  @Input() total = 0;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [];
  @Output() readonly pageIndexChange = new EventEmitter<number>();
  @Output() readonly pageSizeChange = new EventEmitter<number>();
  listOfPageSizeOption: Array<{ value: number; label: string }> = [];

  onPageSizeChange(size: number): void {
    if (this.pageSize !== size) {
      this.pageSizeChange.next(size);
    }
  }

  jumpToPageViaInput($event: Event): void {
    const target = $event.target as HTMLInputElement;
    const index = Math.floor(toNumber(target.value, this.pageIndex));
    this.pageIndexChange.next(index);
    target.value = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { pageSize, pageSizeOptions, locale } = changes;
    if (pageSize || pageSizeOptions || locale) {
      this.listOfPageSizeOption = [...new Set([...this.pageSizeOptions, this.pageSize])].map(item => ({
        value: item,
        label: `${item} ${this.locale.items_per_page}`
      }));
    }
  }
}
