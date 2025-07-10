/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriMenuModeType, TriSubmenuTrigger } from './menu.types';

@Component({
  selector: '',
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
    @if (isMenuInsideDropDown) {
      <span class="tri-dropdown-menu-submenu-expand-icon">
        @switch (dir) {
          @case ('rtl') {
            <tri-icon type="left" class="tri-dropdown-menu-submenu-arrow-icon" />
          }
          @default {
            <tri-icon type="right" class="tri-dropdown-menu-submenu-arrow-icon" />
          }
        }
      </span>
    } @else {
      <span class="tri-menu-submenu-arrow"></span>
    }
  `,
  host: {
    '[class.tri-dropdown-menu-submenu-title]': 'isMenuInsideDropDown',
    '[class.tri-menu-submenu-title]': '!isMenuInsideDropDown',
    '[style.paddingLeft.px]': `dir === 'rtl' ? null : paddingLeft `,
    '[style.paddingRight.px]': `dir === 'rtl' ? paddingLeft : null`,
    '(click)': 'clickTitle()',
    '(mouseenter)': 'setMouseState(true)',
    '(mouseleave)': 'setMouseState(false)'
  },
  imports: [TriIconModule, TriOutletModule]
})
export class TriSubMenuTitleComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly directionality = inject(Directionality);

  @Input() icon: string | null = null;
  @Input() title: string | TemplateRef<void> | null = null;
  @Input() isMenuInsideDropDown = false;
  @Input() disabled = false;
  @Input() paddingLeft: number | null = null;
  @Input() mode: TriMenuModeType = 'vertical';
  @Input() triggerSubMenuAction: TriSubmenuTrigger = 'hover';
  @Output() readonly toggleSubMenu = new EventEmitter();
  @Output() readonly subMenuMouseState = new EventEmitter<boolean>();

  dir: Direction = 'ltr';

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
  }

  setMouseState(state: boolean): void {
    if (!this.disabled && this.triggerSubMenuAction === 'hover') {
      this.subMenuMouseState.next(state);
    }
  }

  clickTitle(): void {
    if ((this.mode === 'inline' || this.triggerSubMenuAction === 'click') && !this.disabled) {
      this.subMenuMouseState.next(true);
      this.toggleSubMenu.emit();
    }
  }
}
