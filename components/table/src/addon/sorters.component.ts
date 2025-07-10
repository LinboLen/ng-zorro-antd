/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriTableSortOrder } from '../table.types';

@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="tri-table-column-title"><ng-template [ngTemplateOutlet]="contentTemplate"></ng-template></span>
    <span class="tri-table-column-sorter" [class.tri-table-column-sorter-full]="isDown && isUp">
      <span class="tri-table-column-sorter-inner">
        @if (isUp) {
          <tri-icon type="caret-up" class="tri-table-column-sorter-up" [class.active]="sortOrder === 'ascend'" />
        }
        @if (isDown) {
          <tri-icon type="caret-down" class="tri-table-column-sorter-down" [class.active]="sortOrder === 'descend'" />
        }
      </span>
    </span>
  `,
  host: {
    class: 'tri-table-column-sorters'
  },
  imports: [TriIconModule, NgTemplateOutlet]
})
export class TriTableSortersComponent implements OnChanges {
  @Input() sortDirections: TriTableSortOrder[] = ['ascend', 'descend', null];
  @Input() sortOrder: TriTableSortOrder = null;
  @Input() contentTemplate: TemplateRef<TriSafeAny> | null = null;
  isUp = false;
  isDown = false;

  ngOnChanges(changes: SimpleChanges): void {
    const { sortDirections } = changes;
    if (sortDirections) {
      this.isUp = this.sortDirections.indexOf('ascend') !== -1;
      this.isDown = this.sortDirections.indexOf('descend') !== -1;
    }
  }
}
