/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriCheckboxComponent } from './checkbox.component';

/**
 * @deprecated Will be removed in v21. It is recommended to use `<nz-checkbox-group>`.
 */
@Component({
  selector: '',
  exportAs: 'triCheckboxWrapper',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-checkbox-group'
  }
})
export class TriCheckboxWrapperComponent {
  @Output() readonly onChange = new EventEmitter<TriSafeAny[]>();
  private checkboxList: TriCheckboxComponent[] = [];

  addCheckbox(value: TriCheckboxComponent): void {
    this.checkboxList.push(value);
  }

  removeCheckbox(value: TriCheckboxComponent): void {
    this.checkboxList.splice(this.checkboxList.indexOf(value), 1);
  }

  _onChange(): void {
    const listOfCheckedValue = this.checkboxList.filter(item => item.checked).map(item => item.value);
    this.onChange.emit(listOfCheckedValue);
  }
}
