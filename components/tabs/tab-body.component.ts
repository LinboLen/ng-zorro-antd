/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { tabSwitchMotion } from 'ng-zorro-antd/core/animation';

@Component({
  selector: '[tri-tab-body]',
  exportAs: 'triTabBody',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template [ngTemplateOutlet]="content"></ng-template>`,
  host: {
    class: 'tri-tabs-tabpane',
    '[class.tri-tabs-tabpane-active]': 'active',
    '[class.tri-tabs-tabpane-hidden]': 'animated ? null : !active',
    '[attr.tabindex]': 'active ? 0 : -1',
    '[attr.aria-hidden]': '!active',
    '[style.overflow-y]': 'animated ? active ? null : "none" : null',
    '[@tabSwitchMotion]': `active ? 'enter' : 'leave'`,
    '[@.disabled]': `!animated`
  },
  imports: [NgTemplateOutlet],
  animations: [tabSwitchMotion]
})
export class TriTabBodyComponent {
  @Input() content: TemplateRef<void> | null = null;
  @Input() active = false;
  @Input() animated = true;
}
