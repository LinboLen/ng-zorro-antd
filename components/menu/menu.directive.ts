/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest } from 'rxjs';

import { TriMenuItemComponent } from './menu-item.component';
import { MenuService } from './menu.service';
import { TriIsMenuInsideDropDownToken, TriMenuServiceLocalToken } from './menu.token';
import { TriMenuModeType, TriMenuThemeType } from './menu.types';
import { TriSubMenuComponent } from './submenu.component';

export function MenuServiceFactory(): MenuService {
  const serviceInsideDropDown = inject(MenuService, { skipSelf: true, optional: true });
  const serviceOutsideDropDown = inject(TriMenuServiceLocalToken);
  return serviceInsideDropDown ?? serviceOutsideDropDown;
}

export function MenuDropDownTokenFactory(): boolean {
  const isMenuInsideDropDownToken = inject(TriIsMenuInsideDropDownToken, { skipSelf: true, optional: true });
  return isMenuInsideDropDownToken ?? false;
}

@Directive({
  selector: '[tri-menu]',
  exportAs: 'triMenu',
  providers: [
    {
      provide: TriMenuServiceLocalToken,
      useClass: MenuService
    },
    /** use the top level service **/
    {
      provide: MenuService,
      useFactory: MenuServiceFactory
    },
    /** check if menu inside dropdown-menu component **/
    {
      provide: TriIsMenuInsideDropDownToken,
      useFactory: MenuDropDownTokenFactory
    }
  ],
  host: {
    '[class.tri-dropdown-menu]': `isMenuInsideDropDown`,
    '[class.tri-dropdown-menu-root]': `isMenuInsideDropDown`,
    '[class.tri-dropdown-menu-light]': `isMenuInsideDropDown && theme === 'light'`,
    '[class.tri-dropdown-menu-dark]': `isMenuInsideDropDown && theme === 'dark'`,
    '[class.tri-dropdown-menu-vertical]': `isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.tri-dropdown-menu-horizontal]': `isMenuInsideDropDown && actualMode === 'horizontal'`,
    '[class.tri-dropdown-menu-inline]': `isMenuInsideDropDown && actualMode === 'inline'`,
    '[class.tri-dropdown-menu-inline-collapsed]': `isMenuInsideDropDown && inlineCollapsed`,
    '[class.tri-menu]': `!isMenuInsideDropDown`,
    '[class.tri-menu-root]': `!isMenuInsideDropDown`,
    '[class.tri-menu-light]': `!isMenuInsideDropDown && theme === 'light'`,
    '[class.tri-menu-dark]': `!isMenuInsideDropDown && theme === 'dark'`,
    '[class.tri-menu-vertical]': `!isMenuInsideDropDown && actualMode === 'vertical'`,
    '[class.tri-menu-horizontal]': `!isMenuInsideDropDown && actualMode === 'horizontal'`,
    '[class.tri-menu-inline]': `!isMenuInsideDropDown && actualMode === 'inline'`,
    '[class.tri-menu-inline-collapsed]': `!isMenuInsideDropDown && inlineCollapsed`,
    '[class.tri-menu-rtl]': `dir === 'rtl'`
  }
})
export class TriMenuDirective implements AfterContentInit, OnInit, OnChanges {
  private readonly menuService = inject(MenuService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly directionality = inject(Directionality);

  @ContentChildren(TriMenuItemComponent, { descendants: true })
  listOfNzMenuItemDirective!: QueryList<TriMenuItemComponent>;
  isMenuInsideDropDown = inject(TriIsMenuInsideDropDownToken);
  @ContentChildren(TriSubMenuComponent, { descendants: true }) listOfNzSubMenuComponent!: QueryList<TriSubMenuComponent>;
  @Input() inlineIndent = 24;
  @Input() theme: TriMenuThemeType = 'light';
  @Input() mode: TriMenuModeType = 'vertical';
  @Input({ transform: booleanAttribute }) inlineCollapsed = false;
  @Input({ transform: booleanAttribute }) selectable = !this.isMenuInsideDropDown;
  @Output() readonly click = new EventEmitter<TriMenuItemComponent>();
  actualMode: TriMenuModeType = 'vertical';
  dir: Direction = 'ltr';
  private inlineCollapsed$ = new BehaviorSubject<boolean>(this.inlineCollapsed);
  private mode$ = new BehaviorSubject<TriMenuModeType>(this.mode);
  private listOfOpenedNzSubMenuComponent: TriSubMenuComponent[] = [];

  setInlineCollapsed(inlineCollapsed: boolean): void {
    this.inlineCollapsed = inlineCollapsed;
    this.inlineCollapsed$.next(inlineCollapsed);
  }

  updateInlineCollapse(): void {
    if (this.listOfNzMenuItemDirective) {
      if (this.inlineCollapsed) {
        this.listOfOpenedNzSubMenuComponent = this.listOfNzSubMenuComponent.filter(submenu => submenu.open);
        this.listOfNzSubMenuComponent.forEach(submenu => submenu.setOpenStateWithoutDebounce(false));
      } else {
        this.listOfOpenedNzSubMenuComponent.forEach(submenu => submenu.setOpenStateWithoutDebounce(true));
        this.listOfOpenedNzSubMenuComponent = [];
      }
    }
  }

  ngOnInit(): void {
    combineLatest([this.inlineCollapsed$, this.mode$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([inlineCollapsed, mode]) => {
        this.actualMode = inlineCollapsed ? 'vertical' : mode;
        this.menuService.setMode(this.actualMode);
        this.cdr.markForCheck();
      });
    this.menuService.descendantMenuItemClick$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(menu => {
      this.click.emit(menu);
      if (this.selectable && !menu.nzMatchRouter) {
        this.listOfNzMenuItemDirective.forEach(item => item.setSelectedState(item === menu));
      }
    });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.menuService.setMode(this.actualMode);
      this.cdr.markForCheck();
    });
  }

  ngAfterContentInit(): void {
    this.inlineCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateInlineCollapse();
      this.cdr.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzInlineCollapsed, nzInlineIndent, nzTheme, nzMode } = changes;
    if (nzInlineCollapsed) {
      this.inlineCollapsed$.next(this.inlineCollapsed);
    }
    if (nzInlineIndent) {
      this.menuService.setInlineIndent(this.inlineIndent);
    }
    if (nzTheme) {
      this.menuService.setTheme(this.theme);
    }
    if (nzMode) {
      this.mode$.next(this.mode);
      if (!nzMode.isFirstChange() && this.listOfNzSubMenuComponent) {
        this.listOfNzSubMenuComponent.forEach(submenu => submenu.setOpenStateWithoutDebounce(false));
      }
    }
  }
}
