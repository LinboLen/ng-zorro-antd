/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { arraysEqual } from 'ng-zorro-antd/core/util';
import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriI18nService, TriTableI18nInterface } from 'ng-zorro-antd/i18n';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriRadioComponent } from 'ng-zorro-antd/radio';

import { TriTableFilterList } from '../table.types';
import { TriFilterTriggerComponent } from './filter-trigger.component';

interface TriThItemInterface {
  text: string;
  value: TriSafeAny;
  checked: boolean;
}

@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="tri-table-column-title">
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    </span>
    @if (!customFilter) {
      <tri-filter-trigger
        [visible]="isVisible"
        [active]="isChecked"
        [dropdownMenu]="filterMenu"
        (visibleChange)="onVisibleChange($event)"
      >
        <tri-icon type="filter" theme="fill" />
      </tri-filter-trigger>
      <tri-dropdown-menu #filterMenu="nzDropdownMenu">
        <div class="tri-table-filter-dropdown">
          <ul tri-menu>
            @for (f of listOfParsedFilter; track f.value) {
              <li tri-menu-item [selected]="f.checked" (click)="check(f)">
                @if (!filterMultiple) {
                  <label tri-radio [ngModel]="f.checked" (ngModelChange)="check(f)"></label>
                } @else {
                  <label tri-checkbox [ngModel]="f.checked" (ngModelChange)="check(f)"></label>
                }
                <span>{{ f.text }}</span>
              </li>
            }
          </ul>
          <div class="tri-table-filter-dropdown-btns">
            <button tri-button type="link" size="small" (click)="reset()" [disabled]="!isChecked">
              {{ locale.filterReset }}
            </button>
            <button tri-button type="primary" size="small" (click)="confirm()">{{ locale.filterConfirm }}</button>
          </div>
        </div>
      </tri-dropdown-menu>
    } @else {
      <ng-container [ngTemplateOutlet]="extraTemplate"></ng-container>
    }
  `,
  host: { class: 'tri-table-filter-column' },
  imports: [
    NgTemplateOutlet,
    TriFilterTriggerComponent,
    TriIconModule,
    TriDropDownModule,
    TriRadioComponent,
    TriCheckboxModule,
    FormsModule,
    TriButtonModule
  ]
})
export class TriTableFilterComponent implements OnChanges, OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly i18n = inject(TriI18nService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() contentTemplate: TemplateRef<TriSafeAny> | null = null;
  @Input() customFilter = false;
  @Input() extraTemplate: TemplateRef<TriSafeAny> | null = null;
  @Input() filterMultiple = true;
  @Input() listOfFilter: TriTableFilterList = [];
  @Output() readonly filterChange = new EventEmitter<TriSafeAny[] | TriSafeAny>();
  locale!: TriTableI18nInterface;
  isChecked = false;
  isVisible = false;
  listOfParsedFilter: TriThItemInterface[] = [];
  listOfChecked: TriSafeAny[] = [];

  check(filter: TriThItemInterface): void {
    if (this.filterMultiple) {
      this.listOfParsedFilter = this.listOfParsedFilter.map(item => {
        if (item === filter) {
          return { ...item, checked: !filter.checked };
        } else {
          return item;
        }
      });
      filter.checked = !filter.checked;
    } else {
      this.listOfParsedFilter = this.listOfParsedFilter.map(item => ({ ...item, checked: item === filter }));
    }
    this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
  }

  confirm(): void {
    this.isVisible = false;
    this.emitFilterData();
  }

  reset(): void {
    this.isVisible = false;
    this.listOfParsedFilter = this.parseListOfFilter(this.listOfFilter, true);
    this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
    this.emitFilterData();
  }

  onVisibleChange(value: boolean): void {
    this.isVisible = value;
    if (!value) {
      this.emitFilterData();
    } else {
      this.listOfChecked = this.listOfParsedFilter.filter(item => item.checked).map(item => item.value);
    }
  }

  emitFilterData(): void {
    const listOfChecked = this.listOfParsedFilter.filter(item => item.checked).map(item => item.value);
    if (!arraysEqual(this.listOfChecked, listOfChecked)) {
      if (this.filterMultiple) {
        this.filterChange.emit(listOfChecked);
      } else {
        this.filterChange.emit(listOfChecked.length > 0 ? listOfChecked[0] : null);
      }
    }
  }

  parseListOfFilter(listOfFilter: TriTableFilterList, reset?: boolean): TriThItemInterface[] {
    return listOfFilter.map(item => {
      const checked = reset ? false : !!item.byDefault;
      return { text: item.text, value: item.value, checked };
    });
  }

  getCheckedStatus(listOfParsedFilter: TriThItemInterface[]): boolean {
    return listOfParsedFilter.some(item => item.checked);
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Table');
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfFilter } = changes;
    if (listOfFilter && this.listOfFilter && this.listOfFilter.length) {
      this.listOfParsedFilter = this.parseListOfFilter(this.listOfFilter);
      this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
    }
  }
}
