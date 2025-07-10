/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: '',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *stringTemplateOutlet="placeholder">
      {{ placeholder }}
    </ng-container>
  `,
  host: { class: 'tri-select-selection-placeholder' },
  imports: [TriOutletModule]
})
export class TriSelectPlaceholderComponent {
  @Input() placeholder: TemplateRef<TriSafeAny> | string | null = null;
}
