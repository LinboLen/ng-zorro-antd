/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

/**
 * @deprecated Will be removed in v21. It is recommended to use the new version `<nz-input-number>`.
 */
@Component({
  selector: '[tri-input-number-group-slot]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon) {
      <tri-icon [type]="icon" />
    }
    <ng-container *stringTemplateOutlet="template">{{ template }}</ng-container>
    <ng-content></ng-content>
  `,
  host: {
    '[class.tri-input-number-group-addon]': `type === 'addon'`,
    '[class.tri-input-number-prefix]': `type === 'prefix'`,
    '[class.tri-input-number-suffix]': `type === 'suffix'`
  },
  imports: [TriIconModule, TriOutletModule]
})
export class TriInputNumberGroupSlotComponent {
  @Input() icon?: string | null = null;
  @Input() type: 'addon' | 'prefix' | 'suffix' | null = null;
  @Input() template?: string | TemplateRef<void> | null = null;
}
