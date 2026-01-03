/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriIsMenuInsideDropdownToken } from './menu.token';
import { TriMenuModeType, TriSubmenuTrigger } from './menu.types';

@Component({
  selector: '[tri-submenu-title]',
  exportAs: 'triSubmenuTitle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon) {
      <tri-icon [type]="icon" />
    }
    <ng-container *stringTemplateOutlet="title">
      <span class="tri-menu-title-content">{{ title }}</span>
    </ng-container>
    <ng-content />
    @if (isMenuInsideDropdown) {
      <span class="tri-dropdown-menu-submenu-expand-icon">
        <tri-icon [type]="dir() === 'rtl' ? 'left' : 'right'" class="tri-dropdown-menu-submenu-arrow-icon" />
      </span>
    } @else {
      <span class="tri-menu-submenu-arrow"></span>
    }
  `,
  host: {
    '[class.tri-dropdown-menu-submenu-title]': 'isMenuInsideDropdown',
    '[class.tri-menu-submenu-title]': '!isMenuInsideDropdown',
    '[style.padding-inline-start.px]': 'paddingLeft',
    '(click)': 'clickTitle()',
    '(mouseenter)': 'setMouseState(true)',
    '(mouseleave)': 'setMouseState(false)'
  },
  imports: [TriIconModule, TriOutletModule]
})
export class TriSubMenuTitleComponent {
  protected readonly isMenuInsideDropdown = inject(TriIsMenuInsideDropdownToken);
  protected readonly dir = inject(Directionality).valueSignal;

  @Input() icon: string | null = null;
  @Input() title: string | TemplateRef<void> | null = null;
  @Input() disabled = false;
  @Input() paddingLeft: number | null = null;
  @Input() mode: TriMenuModeType = 'vertical';
  @Input() triggerSubMenuAction: TriSubmenuTrigger = 'hover';
  @Output() readonly toggleSubMenu = new EventEmitter();
  @Output() readonly subMenuMouseState = new EventEmitter<boolean>();

  protected setMouseState(state: boolean): void {
    if (!this.disabled && this.triggerSubMenuAction === 'hover') {
      this.subMenuMouseState.next(state);
    }
  }

  protected clickTitle(): void {
    if ((this.mode === 'inline' || this.triggerSubMenuAction === 'click') && !this.disabled) {
      this.subMenuMouseState.next(true);
      this.toggleSubMenu.emit();
    }
  }
}
