/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { merge } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxComponent, TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriEmptyModule } from 'ng-zorro-antd/empty';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

import { RenderListContext, TransferDirection, TransferItem, TransferStat } from './interface';

@Component({
  selector: 'tri-transfer-list',
  exportAs: 'triTransferList',
  imports: [
    TriInputModule,
    FormsModule,
    TriCheckboxModule,
    NgTemplateOutlet,
    TriEmptyModule,
    TriIconModule,
    TriButtonModule
  ],
  template: `
    <div class="tri-transfer-list-header">
      @if (showSelectAll && !oneWay) {
        <label
          class="tri-transfer-list-checkbox"
          tri-checkbox
          #headerCheckbox
          [checked]="stat.checkAll"
          (checkedChange)="onItemSelectAll($event)"
          [indeterminate]="stat.checkHalf"
          [disabled]="stat.availableCount === 0 || disabled"
        ></label>
      }
      <span class="tri-transfer-list-header-selected">
        <span>
          @if (!oneWay) {
            {{ (stat.checkCount > 0 ? stat.checkCount + '/' : '') + stat.shownCount }}
          } @else {
            {{ stat.shownCount }}
          }
          {{ validData.length > 1 ? itemsUnit : itemUnit }}
        </span>
      </span>
      @if (titleText) {
        <span class="tri-transfer-list-header-title">{{ titleText }}</span>
      }
    </div>
    <div class="tri-transfer-list-body" [class.tri-transfer-list-body-with-search]="showSearch">
      @if (showSearch) {
        <div class="tri-transfer-list-body-search-wrapper">
          <tri-input-wrapper class="tri-transfer-list-search" allowClear>
            <tri-icon inputPrefix type="search" />
            <input
              tri-input
              [placeholder]="searchPlaceholder"
              [disabled]="disabled"
              [(ngModel)]="filter"
              (ngModelChange)="handleFilter($event)"
            />
          </tri-input-wrapper>
        </div>
      }
      @if (renderList) {
        <div class="tri-transfer-list-body-customize-wrapper">
          <ng-container
            *ngTemplateOutlet="
              renderList;
              context: {
                $implicit: validData,
                direction: direction,
                disabled: disabled,
                onItemSelectAll: onItemSelectAll,
                onItemSelect: onItemSelect,
                stat: stat
              }
            "
          />
        </div>
      } @else {
        @if (stat.shownCount > 0) {
          <ul class="tri-transfer-list-content">
            @for (item of validData; track item.key) {
              <li
                (click)="!oneWay ? onItemSelect(item) : null"
                class="tri-transfer-list-content-item"
                [class]="{ 'ant-transfer-list-content-item-disabled': disabled || item.disabled }"
              >
                @if (!oneWay) {
                  <label
                    #checkboxes
                    tri-checkbox
                    [checked]="item.checked"
                    (checkedChange)="onItemSelect(item)"
                    [disabled]="disabled || item.disabled"
                  >
                    @if (!render) {
                      {{ item.title }}
                    } @else {
                      <ng-template [ngTemplateOutlet]="render" [ngTemplateOutletContext]="{ $implicit: item }" />
                    }
                  </label>
                } @else {
                  @if (!render) {
                    <span class="tri-transfer-list-content-item-text">
                      {{ item.title }}
                    </span>
                    <div
                      class="tri-transfer-list-content-item-remove"
                      [class]="{ 'ant-transfer-list-content-item-disabled': disabled || item.disabled }"
                      (click)="!(disabled || item.disabled) ? deleteItem(item) : null"
                    >
                      <tri-icon type="delete" theme="outline" />
                    </div>
                  } @else {
                    <ng-template [ngTemplateOutlet]="render" [ngTemplateOutletContext]="{ $implicit: item }" />
                  }
                }
              </li>
            }
          </ul>
        } @else {
          <div class="tri-transfer-list-body-not-found">
            <tri-embed-empty componentName="transfer" [specificContent]="notFoundContent" />
          </div>
        }
      }
    </div>
    @if (footer) {
      <div class="tri-transfer-list-footer">
        <ng-template [ngTemplateOutlet]="footer" [ngTemplateOutletContext]="{ $implicit: direction }" />
      </div>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-transfer-list',
    '[class.tri-transfer-list-with-footer]': '!!footer'
  }
})
export class TriTransferListComponent implements AfterViewInit {
  // #region fields
  private cdr = inject(ChangeDetectorRef);

  @Input() direction: TransferDirection = 'left';
  @Input() titleText = '';
  @Input() showSelectAll = true;

  @Input() dataSource: TransferItem[] = [];

  @Input() itemUnit: string | undefined = '';
  @Input() itemsUnit: string | undefined = '';
  @Input() filter = '';
  @Input() oneWay: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input({ transform: booleanAttribute }) showSearch?: boolean;
  @Input() searchPlaceholder?: string;
  @Input() notFoundContent?: string;
  @Input() filterOption?: (inputValue: string, item: TransferItem) => boolean;

  @Input() renderList: TemplateRef<RenderListContext> | null = null;
  @Input() render: TemplateRef<{ $implicit: TransferItem }> | null = null;
  @Input() footer: TemplateRef<{ $implicit: TransferDirection }> | null = null;

  // events
  @Output() readonly handleSelectAll: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() readonly handleSelect = new EventEmitter<TransferItem>();
  @Output() readonly filterChange = new EventEmitter<{ direction: TransferDirection; value: string }>();
  @Output() readonly moveToLeft = new EventEmitter<void>();

  @ViewChild('headerCheckbox', { read: TriCheckboxComponent }) headerCheckbox?: TriCheckboxComponent;

  @ViewChildren('checkboxes', { read: ElementRef }) checkboxes!: QueryList<ElementRef<HTMLLabelElement>>;

  stat: TransferStat = {
    checkAll: false,
    checkHalf: false,
    checkCount: 0,
    shownCount: 0,
    availableCount: 0
  };

  get validData(): TransferItem[] {
    return this.dataSource.filter(w => !w.hide);
  }

  get availableData(): TransferItem[] {
    // filter disabled data
    return this.validData.filter(w => !w.disabled);
  }

  onItemSelect = (item: TransferItem): void => {
    if (this.disabled || item.disabled) {
      return;
    }
    item.checked = !item.checked;
    this.updateCheckStatus();
    this.handleSelect.emit(item);
  };

  onItemSelectAll = (status: boolean): void => {
    this.dataSource.forEach(item => {
      if (!item.disabled && !item.hide) {
        item.checked = status;
      }
    });

    this.updateCheckStatus();
    this.handleSelectAll.emit(status);
  };

  private updateCheckStatus(): void {
    const validCount = this.dataSource.filter(w => !w.disabled).length;
    this.stat.checkCount = this.dataSource.filter(w => w.checked && !w.disabled).length;
    this.stat.shownCount = this.validData.length;
    this.stat.availableCount = this.availableData.length;
    this.stat.checkAll = validCount > 0 && validCount === this.stat.checkCount;
    this.stat.checkHalf = this.stat.checkCount > 0 && !this.stat.checkAll;
    // Note: this is done explicitly since the internal `nzChecked` value may not be updated in edge cases.
    // Consider the following flow:
    // 1) the initial value of `stat.checkAll` is `false`
    // 2) the user filters items
    // 3) the user clicks "Select All" checkbox
    // 4) the `NzCheckboxComponent` sets `nzChecked` to `true` internally
    // 5) the user clicks "Move to right"
    // 6) items are moved and the `updateCheckStatus` is invoked
    // 7) the `stat.checkAll` value has never been updated in this flow, it's always been `false`
    // 8) the `nzChecked` is still `true` and the checkbox is not unchecked
    // This is because Angular checks bindings and it checked that `[nzChecked]="stat.checkAll"` has
    // never been updated, so Angular did not set new `nzChecked` value on the checkbox.
    this.headerCheckbox && (this.headerCheckbox.checked = this.stat.checkAll);
  }

  // #endregion

  // #region search

  handleFilter(value: string): void {
    this.dataSource.forEach(item => {
      item.hide = value.length > 0 && !this.matchFilter(value, item);
    });
    this.stat.shownCount = this.validData.length;
    this.stat.availableCount = this.availableData.length;
    this.filterChange.emit({ direction: this.direction, value });
  }

  deleteItem(item: TransferItem): void {
    item.checked = true;
    this.handleSelect.emit(item);
    this.moveToLeft.emit();
  }

  private matchFilter(text: string, item: TransferItem): boolean {
    if (this.filterOption) {
      return this.filterOption(text, item);
    }
    return item.title.includes(text);
  }

  // #endregion

  markForCheck(): void {
    this.updateCheckStatus();
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    this.checkboxes.changes
      .pipe(
        startWith(this.checkboxes),
        switchMap(() => {
          const checkboxes = this.checkboxes.toArray();
          return merge(
            ...checkboxes.map(checkbox => fromEventOutsideAngular<MouseEvent>(checkbox.nativeElement, 'click'))
          );
        })
      )
      .subscribe(event => {
        event.stopPropagation();
      });
  }
}
