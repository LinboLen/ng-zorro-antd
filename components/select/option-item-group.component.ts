/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'tri-option-item-group',
  template: `<ng-container *stringTemplateOutlet="label">{{ label }}</ng-container>`,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-select-item ant-select-item-group'
  },
  imports: [TriOutletModule]
})
export class TriOptionItemGroupComponent {
  @Input() label: string | number | TemplateRef<TriSafeAny> | null = null;
}
