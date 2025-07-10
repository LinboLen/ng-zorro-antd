/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriMenuModeType, TriMenuThemeType } from './menu.types';

@Injectable()
export class MenuService {
  /** all descendant menu click **/
  descendantMenuItemClick$ = new Subject<TriSafeAny>();
  /** child menu item click **/
  childMenuItemClick$ = new Subject<TriSafeAny>();
  theme$ = new BehaviorSubject<TriMenuThemeType>('light');
  mode$ = new BehaviorSubject<TriMenuModeType>('vertical');
  inlineIndent$ = new BehaviorSubject<number>(24);
  isChildSubMenuOpen$ = new BehaviorSubject<boolean>(false);

  onDescendantMenuItemClick(menu: TriSafeAny): void {
    this.descendantMenuItemClick$.next(menu);
  }

  onChildMenuItemClick(menu: TriSafeAny): void {
    this.childMenuItemClick$.next(menu);
  }

  setMode(mode: TriMenuModeType): void {
    this.mode$.next(mode);
  }

  setTheme(theme: TriMenuThemeType): void {
    this.theme$.next(theme);
  }

  setInlineIndent(indent: number): void {
    this.inlineIndent$.next(indent);
  }
}
