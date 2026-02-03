/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  ViewEncapsulation
} from '@angular/core';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import type { TriSizeLMSType } from 'ng-zorro-antd/core/types';

import { TriCollapsePanelComponent } from './collapse-panel.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'collapse';

@Component({
  selector: 'tri-collapse',
  exportAs: 'triCollapse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    class: 'tri-collapse',
    '[class.tri-collapse-icon-position-start]': `expandIconPosition === 'start'`,
    '[class.tri-collapse-icon-position-end]': `expandIconPosition === 'end'`,
    '[class.tri-collapse-ghost]': `ghost`,
    '[class.tri-collapse-borderless]': '!bordered',
    '[class.tri-collapse-rtl]': `dir() === 'rtl'`,
    '[class.tri-collapse-small]': `size === 'small'`,
    '[class.tri-collapse-large]': `size === 'large'`
  }
})
export class TriCollapseComponent {
  private cdr = inject(ChangeDetectorRef);
  protected readonly dir = inject(Directionality).valueSignal;

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input({ transform: booleanAttribute }) @WithConfig() accordion: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() bordered: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() ghost: boolean = false;
  @Input() expandIconPosition: 'start' | 'end' = 'start';
  @Input() size: TriSizeLMSType = 'middle';

  private listOfNzCollapsePanelComponent: TriCollapsePanelComponent[] = [];

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  addPanel(value: TriCollapsePanelComponent): void {
    this.listOfNzCollapsePanelComponent.push(value);
  }

  removePanel(value: TriCollapsePanelComponent): void {
    this.listOfNzCollapsePanelComponent.splice(this.listOfNzCollapsePanelComponent.indexOf(value), 1);
  }

  click(collapse: TriCollapsePanelComponent): void {
    const active = collapse._active();
    // if accordion mode, close all panels except the clicked one
    if (this.accordion && !active) {
      this.listOfNzCollapsePanelComponent
        .filter(item => item !== collapse && item._active())
        .forEach(item => item.activate(false));
    }
    collapse.activate(!active);
  }
}
