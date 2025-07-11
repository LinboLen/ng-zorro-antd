/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, Input, TemplateRef } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-tab-close-button,button[nz-tab-close-button]',
  template: `
    <ng-container *stringTemplateOutlet="closeIcon; let icon">
      <tri-icon [type]="icon" theme="outline" />
    </ng-container>
  `,
  host: {
    class: 'tri-tabs-tab-remove',
    'aria-label': 'Close tab',
    type: 'button'
  },
  imports: [TriOutletModule, TriIconModule]
})
export class TriTabCloseButtonComponent {
  @Input() closeIcon: string | TemplateRef<TriSafeAny> = 'close';
}
