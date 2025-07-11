/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, booleanAttribute } from '@angular/core';

@Component({
  selector: 'tri-tree-node-checkbox[builtin]',
  template: `
    <span [class.tri-tree-checkbox-inner]="!selectMode" [class.tri-select-tree-checkbox-inner]="selectMode"></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tri-select-tree-checkbox]': `selectMode`,
    '[class.tri-select-tree-checkbox-checked]': `selectMode && isChecked`,
    '[class.tri-select-tree-checkbox-indeterminate]': `selectMode && isHalfChecked`,
    '[class.tri-select-tree-checkbox-disabled]': `selectMode && (isDisabled || isDisableCheckbox)`,
    '[class.tri-tree-checkbox]': `!selectMode`,
    '[class.tri-tree-checkbox-checked]': `!selectMode && isChecked`,
    '[class.tri-tree-checkbox-indeterminate]': `!selectMode && isHalfChecked`,
    '[class.tri-tree-checkbox-disabled]': `!selectMode && (isDisabled || isDisableCheckbox)`
  }
})
export class TriTreeNodeBuiltinCheckboxComponent {
  @Input() selectMode = false;
  @Input({ transform: booleanAttribute }) isChecked?: boolean;
  @Input({ transform: booleanAttribute }) isHalfChecked?: boolean;
  @Input({ transform: booleanAttribute }) isDisabled?: boolean;
  @Input({ transform: booleanAttribute }) isDisableCheckbox?: boolean;
}
