/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { slideMotion, zoomBigMotion } from 'ng-zorro-antd/core/animation';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriMenuModeType, TriMenuThemeType, TriSubmenuTrigger } from './menu.types';

@Component({
  selector: '',
  exportAs: 'triSubmenuNoneInlineChild',
  encapsulation: ViewEncapsulation.None,
  animations: [zoomBigMotion, slideMotion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class.tri-dropdown-menu]="isMenuInsideDropDown"
      [class.tri-menu]="!isMenuInsideDropDown"
      [class.tri-dropdown-menu-vertical]="isMenuInsideDropDown"
      [class.tri-menu-vertical]="!isMenuInsideDropDown"
      [class.tri-dropdown-menu-sub]="isMenuInsideDropDown"
      [class.tri-menu-sub]="!isMenuInsideDropDown"
      [class.tri-menu-rtl]="dir === 'rtl'"
      [class]="menuClass"
    >
      <ng-template [ngTemplateOutlet]="templateOutlet"></ng-template>
    </div>
  `,
  host: {
    class: 'tri-menu-submenu ant-menu-submenu-popup',
    '[class.tri-menu-light]': "theme === 'light'",
    '[class.tri-menu-dark]': "theme === 'dark'",
    '[class.tri-menu-submenu-placement-bottom]': "mode === 'horizontal'",
    '[class.tri-menu-submenu-placement-right]': "mode === 'vertical' && position === 'right'",
    '[class.tri-menu-submenu-placement-left]': "mode === 'vertical' && position === 'left'",
    '[class.tri-menu-submenu-rtl]': 'dir ==="rtl"',
    '[@slideMotion]': 'expandState',
    '[@zoomBigMotion]': 'expandState',
    '(mouseenter)': 'setMouseState(true)',
    '(mouseleave)': 'setMouseState(false)'
  },
  imports: [NgTemplateOutlet]
})
export class TriSubmenuNoneInlineChildComponent implements OnInit, OnChanges {
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);

  @Input() menuClass: string = '';
  @Input() theme: TriMenuThemeType = 'light';
  @Input() templateOutlet: TemplateRef<TriSafeAny> | null = null;
  @Input() isMenuInsideDropDown = false;
  @Input() mode: TriMenuModeType = 'vertical';
  @Input() triggerSubMenuAction: TriSubmenuTrigger = 'hover';
  @Input() position = 'right';
  @Input() disabled = false;
  @Input() open = false;
  @Output() readonly subMenuMouseState = new EventEmitter<boolean>();

  expandState = 'collapsed';
  dir: Direction = 'ltr';

  setMouseState(state: boolean): void {
    if (!this.disabled && this.triggerSubMenuAction === 'hover') {
      this.subMenuMouseState.next(state);
    }
  }

  calcMotionState(): void {
    if (this.open) {
      if (this.mode === 'horizontal') {
        this.expandState = 'bottom';
      } else if (this.mode === 'vertical') {
        this.expandState = 'active';
      }
    } else {
      this.expandState = 'collapsed';
    }
  }

  ngOnInit(): void {
    this.calcMotionState();

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { mode, nzOpen } = changes;
    if (mode || nzOpen) {
      this.calcMotionState();
    }
  }
}
