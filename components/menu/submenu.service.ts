/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, Subject, combineLatest, merge } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { MenuService } from './menu.service';
import { TriIsMenuInsideDropdownToken } from './menu.token';
import { TriMenuModeType } from './menu.types';

@Injectable()
export class TriSubmenuService {
  public readonly menuService = inject(MenuService);
  private readonly isMenuInsideDropdown = inject(TriIsMenuInsideDropdownToken);
  private readonly hostSubmenuService = inject(TriSubmenuService, { optional: true, skipSelf: true });

  mode$: Observable<TriMenuModeType> = this.menuService.mode$.pipe(
    map(mode => {
      if (mode === 'inline') {
        return 'inline';
        /** if inside another submenu, set the mode to vertical **/
      } else if (mode === 'vertical' || this.hostSubmenuService) {
        return 'vertical';
      } else {
        return 'horizontal';
      }
    })
  );
  level = 1;
  isCurrentSubMenuOpen$ = new BehaviorSubject<boolean>(false);
  private isChildSubMenuOpen$ = new BehaviorSubject<boolean>(false);
  /** submenu title & overlay mouse enter status **/
  private isMouseEnterTitleOrOverlay$ = new Subject<boolean>();
  private childMenuItemClick$ = new Subject<TriSafeAny>();
  /**
   * menu item inside submenu clicked
   */
  onChildMenuItemClick(menu: TriSafeAny): void {
    this.childMenuItemClick$.next(menu);
  }
  setOpenStateWithoutDebounce(value: boolean): void {
    this.isCurrentSubMenuOpen$.next(value);
  }
  setMouseEnterTitleOrOverlayState(value: boolean): void {
    this.isMouseEnterTitleOrOverlay$.next(value);
  }

  constructor() {
    if (this.hostSubmenuService) {
      this.level = this.hostSubmenuService.level + 1;
    }

    /** close if menu item clicked **/
    const isClosedByMenuItemClick = this.childMenuItemClick$.pipe(
      mergeMap(() => this.mode$),
      filter(mode => mode !== 'inline' || this.isMenuInsideDropdown),
      map(() => false)
    );
    const isCurrentSubmenuOpen$ = merge(this.isMouseEnterTitleOrOverlay$, isClosedByMenuItemClick);
    /** combine the child submenu status with current submenu status to calculate host submenu open **/
    const isSubMenuOpenWithDebounce$ = combineLatest([this.isChildSubMenuOpen$, isCurrentSubmenuOpen$]).pipe(
      map(([isChildSubMenuOpen, isCurrentSubmenuOpen]) => isChildSubMenuOpen || isCurrentSubmenuOpen),
      auditTime(150)
    );
    isSubMenuOpenWithDebounce$.pipe(distinctUntilChanged(), takeUntilDestroyed()).subscribe(data => {
      this.setOpenStateWithoutDebounce(data);
      if (this.hostSubmenuService) {
        /** set parent submenu's child submenu open status **/
        this.hostSubmenuService.isChildSubMenuOpen$.next(data);
      } else {
        this.menuService.isChildSubMenuOpen$.next(data);
      }
    });
  }
}
