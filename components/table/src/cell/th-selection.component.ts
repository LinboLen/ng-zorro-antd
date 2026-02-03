/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute
} from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTableSelectionComponent } from '../addon/selection.component';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tri-table-selection
      [checked]="checked"
      [disabled]="disabled"
      [indeterminate]="indeterminate"
      [label]="label"
      [listOfSelections]="selections"
      [showCheckbox]="showCheckbox"
      [showRowSelection]="showRowSelection"
      (checkedChange)="onCheckedChange($event)"
    />
    <ng-content />
  `,
  host: { class: 'tri-table-selection-column' },
  imports: [TriTableSelectionComponent]
})
export class TriThSelectionComponent implements OnChanges {
  @Input() selections: Array<{ text: string; onSelect(...args: TriSafeAny[]): TriSafeAny }> = [];
  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() indeterminate = false;
  @Input() label: string | null = null;
  @Input({ transform: booleanAttribute }) showCheckbox = false;
  @Input({ transform: booleanAttribute }) showRowSelection = false;
  @Output() readonly checkedChange = new EventEmitter<boolean>();

  private isNzShowExpandChanged = false;
  private isNzShowCheckboxChanged = false;

  onCheckedChange(checked: boolean): void {
    this.checked = checked;
    this.checkedChange.emit(checked);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isFirstChange = (value: SimpleChange): boolean =>
      value && value.firstChange && value.currentValue !== undefined;
    const { nzChecked, nzSelections, nzShowExpand, nzShowCheckbox } = changes;
    if (nzShowExpand) {
      this.isNzShowExpandChanged = true;
    }
    if (nzShowCheckbox) {
      this.isNzShowCheckboxChanged = true;
    }
    if (isFirstChange(nzSelections) && !this.isNzShowExpandChanged) {
      this.showRowSelection = true;
    }
    if (isFirstChange(nzChecked) && !this.isNzShowCheckboxChanged) {
      this.showCheckbox = true;
    }
  }
}
