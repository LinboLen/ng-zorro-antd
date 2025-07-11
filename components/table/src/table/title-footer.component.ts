/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'tri-table-title-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
    <ng-container *stringTemplateOutlet="footer">{{ footer }}</ng-container>
  `,
  host: {
    '[class.tri-table-title]': `title !== null`,
    '[class.tri-table-footer]': `footer !== null`
  },
  imports: [TriOutletModule]
})
export class TriTableTitleFooterComponent {
  @Input() title: string | TemplateRef<TriSafeAny> | null = null;
  @Input() footer: string | TemplateRef<TriSafeAny> | null = null;
}
