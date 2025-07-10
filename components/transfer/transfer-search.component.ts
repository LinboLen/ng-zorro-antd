/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  exportAs: 'triTransferSearch',
  template: `
    <span class="tri-input-prefix">
      <tri-icon type="search" />
    </span>
    <input
      [(ngModel)]="value"
      (ngModelChange)="_handle()"
      [disabled]="disabled"
      [placeholder]="placeholder"
      class="tri-input"
      [class.tri-input-disabled]="disabled"
    />
    @if (value && value.length > 0) {
      <span class="tri-input-suffix" (click)="_clear()">
        <tri-icon type="close-circle" theme="fill" class="tri-input-clear-icon" />
      </span>
    }
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TriIconModule]
})
export class TriTransferSearchComponent implements OnChanges {
  // region: fields
  private cdr = inject(ChangeDetectorRef);

  @Input() placeholder?: string;
  @Input() value?: string;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  @Output() readonly valueChanged = new EventEmitter<string>();
  @Output() readonly valueClear = new EventEmitter<void>();

  // endregion

  protected _handle(): void {
    this.valueChanged.emit(this.value);
  }

  protected _clear(): void {
    if (this.disabled) {
      return;
    }
    this.value = '';
    this.valueClear.emit();
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }
}
