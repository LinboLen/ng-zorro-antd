/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/* eslint-disable @angular-eslint/component-selector */
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCheckboxModule } from 'ng-zorro-antd/checkbox';

import { TriRowExpandButtonDirective } from '../addon/row-expand-button.directive';
import { TriRowIndentDirective } from '../addon/row-indent.directive';

@Component({
  selector:
    'td[nzChecked],td[nzDisabled],td[nzIndeterminate],td[nzIndentSize],td[nzExpand],td[nzShowExpand],td[nzShowCheckbox]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (showExpand || indentSize > 0) {
      <tri-row-indent [indentSize]="indentSize" />
      @if (expandIcon) {
        <ng-template [ngTemplateOutlet]="expandIcon" />
      } @else {
        <button
          tri-row-expand-button
          [expand]="expand"
          (expandChange)="onExpandChange($event)"
          [spaceMode]="!showExpand"
        ></button>
      }
    }
    @if (showCheckbox) {
      <label
        tri-checkbox
        [disabled]="disabled"
        [ngModel]="checked"
        [indeterminate]="indeterminate"
        [attr.aria-label]="label"
        (ngModelChange)="onCheckedChange($event)"
      ></label>
    }
    <ng-content />
  `,
  host: {
    '[class.tri-table-cell-with-append]': `showExpand || indentSize > 0`,
    '[class.tri-table-selection-column]': `showCheckbox`
  },
  imports: [TriRowIndentDirective, TriRowExpandButtonDirective, NgTemplateOutlet, TriCheckboxModule, FormsModule]
})
export class TriTdAddOnComponent implements OnChanges {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() indeterminate = false;
  @Input() label: string | null = null;
  @Input() indentSize = 0;
  @Input({ transform: booleanAttribute }) showExpand = false;
  @Input({ transform: booleanAttribute }) showCheckbox = false;
  @Input({ transform: booleanAttribute }) expand = false;
  @Input() expandIcon: TemplateRef<void> | null = null;
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  @Output() readonly expandChange = new EventEmitter<boolean>();
  private isNzShowExpandChanged = false;
  private isNzShowCheckboxChanged = false;

  onCheckedChange(checked: boolean): void {
    this.checked = checked;
    this.checkedChange.emit(checked);
  }

  onExpandChange(expand: boolean): void {
    this.expand = expand;
    this.expandChange.emit(expand);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const isFirstChange = (value: SimpleChange): boolean =>
      value && value.firstChange && value.currentValue !== undefined;
    const { nzExpand, nzChecked, nzShowExpand, nzShowCheckbox } = changes;
    if (nzShowExpand) {
      this.isNzShowExpandChanged = true;
    }
    if (nzShowCheckbox) {
      this.isNzShowCheckboxChanged = true;
    }
    if (isFirstChange(nzExpand) && !this.isNzShowExpandChanged) {
      this.showExpand = true;
    }
    if (isFirstChange(nzChecked) && !this.isNzShowCheckboxChanged) {
      this.showCheckbox = true;
    }
  }
}
