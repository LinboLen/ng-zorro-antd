/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import type { TriSizeLMSType } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'tri-divider',
  exportAs: 'triDivider',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (text) {
      <span class="tri-divider-inner-text">
        <ng-container *stringTemplateOutlet="text">{{ text }}</ng-container>
      </span>
    }
  `,
  host: {
    class: 'tri-divider',
    '[class.tri-divider-horizontal]': `type === 'horizontal'`,
    '[class.tri-divider-vertical]': `type === 'vertical'`,
    '[class.tri-divider-with-text]': `text`,
    '[class.tri-divider-plain]': `plain`,
    '[class.tri-divider-with-text-left]': `text && orientation === 'left'`,
    '[class.tri-divider-with-text-right]': `text && orientation === 'right'`,
    '[class.tri-divider-with-text-center]': `text && orientation === 'center'`,
    '[class.tri-divider-dashed]': `dashed || variant === 'dashed'`,
    '[class.tri-divider-dotted]': `variant === 'dotted'`,
    '[class.tri-divider-sm]': `size === 'small'`,
    '[class.tri-divider-md]': `size === 'middle'`
  },
  imports: [TriOutletModule]
})
export class TriDividerComponent {
  @Input() text?: string | TemplateRef<void>;
  @Input() type: 'horizontal' | 'vertical' = 'horizontal';
  @Input() orientation: 'left' | 'right' | 'center' = 'center';
  @Input() variant: 'dashed' | 'dotted' | 'solid' = 'solid';
  @Input() size: TriSizeLMSType | undefined;
  @Input({ transform: booleanAttribute }) dashed = false;
  @Input({ transform: booleanAttribute }) plain = false;
}
