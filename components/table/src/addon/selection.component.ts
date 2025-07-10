/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (showCheckbox) {
      <label
        tri-checkbox
        [class.tri-table-selection-select-all-custom]="showRowSelection"
        [ngModel]="checked"
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [attr.aria-label]="label"
        (ngModelChange)="onCheckedChange($event)"
      ></label>
    }
    @if (showRowSelection) {
      <div class="tri-table-selection-extra">
        <span tri-dropdown class="tri-table-selection-down" placement="bottomLeft" [dropdownMenu]="selectionMenu">
          <tri-icon type="down" />
        </span>
        <tri-dropdown-menu #selectionMenu="nzDropdownMenu">
          <ul tri-menu class="tri-table-selection-menu">
            @for (selection of listOfSelections; track selection) {
              <li tri-menu-item (click)="selection.onSelect()">
                {{ selection.text }}
              </li>
            }
          </ul>
        </tri-dropdown-menu>
      </div>
    }
  `,
  host: { class: 'tri-table-selection' },
  imports: [FormsModule, TriCheckboxModule, TriDropDownModule, TriIconModule]
})
export class TriTableSelectionComponent {
  @Input() listOfSelections: Array<{ text: string; onSelect(...args: TriSafeAny[]): TriSafeAny }> = [];
  @Input() checked = false;
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() label: string | null = null;
  @Input() showCheckbox = false;
  @Input() showRowSelection = false;
  @Output() readonly checkedChange = new EventEmitter<boolean>();

  onCheckedChange(checked: boolean): void {
    this.checked = checked;
    this.checkedChange.emit(checked);
  }
}
