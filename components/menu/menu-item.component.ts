/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  DestroyRef,
  ChangeDetectorRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { numberAttributeWithZeroFallback } from 'ng-zorro-antd/core/util';

import { MenuService } from './menu.service';
import { TriIsMenuInsideDropdownToken } from './menu.token';
import { TriSubmenuService } from './submenu.service';

@Component({
  selector: '[tri-menu-item]',
  exportAs: 'triMenuItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="tri-menu-title-content">
      <ng-content></ng-content>
    </span>
  `,
  host: {
    '[class.tri-dropdown-menu-item]': `isMenuInsideDropdown`,
    '[class.tri-dropdown-menu-item-selected]': `isMenuInsideDropdown && selected`,
    '[class.tri-dropdown-menu-item-danger]': `isMenuInsideDropdown && danger`,
    '[class.tri-dropdown-menu-item-disabled]': `isMenuInsideDropdown && disabled`,
    '[class.tri-menu-item]': `!isMenuInsideDropdown`,
    '[class.tri-menu-item-selected]': `!isMenuInsideDropdown && selected`,
    '[class.tri-menu-item-danger]': `!isMenuInsideDropdown && danger`,
    '[class.tri-menu-item-disabled]': `!isMenuInsideDropdown && disabled`,
    '[style.paddingLeft.px]': `dir === 'rtl' ? null : nzPaddingLeft || inlinePaddingLeft`,
    '[style.paddingRight.px]': `dir === 'rtl' ? nzPaddingLeft || inlinePaddingLeft : null`,
    '(click)': 'clickMenuItem($event)'
  }
})
export class TriMenuItemComponent implements OnInit, OnChanges, AfterContentInit {
  private readonly menuService = inject(MenuService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly submenuService = inject(TriSubmenuService, { optional: true });
  private readonly directionality = inject(Directionality);
  private readonly routerLink = inject(RouterLink, { optional: true });
  private readonly router = inject(Router, { optional: true });
  protected readonly isMenuInsideDropdown = inject(TriIsMenuInsideDropdownToken);

  level = this.submenuService ? this.submenuService.level + 1 : 1;
  selected$ = new Subject<boolean>();
  inlinePaddingLeft: number | null = null;
  dir: Direction = 'ltr';
  @Input({ transform: numberAttributeWithZeroFallback }) paddingLeft?: number;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) selected = false;
  @Input({ transform: booleanAttribute }) danger = false;
  @Input({ transform: booleanAttribute }) matchRouterExact = false;
  @Input({ transform: booleanAttribute }) matchRouter = false;
  @ContentChildren(RouterLink, { descendants: true }) listOfRouterLink!: QueryList<RouterLink>;

  /** clear all item selected status except this */
  clickMenuItem(e: MouseEvent): void {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.menuService.onDescendantMenuItemClick(this);
    if (this.submenuService) {
      /** menu item inside the submenu **/
      this.submenuService.onChildMenuItemClick(this);
    } else {
      /** menu item inside the root menu **/
      this.menuService.onChildMenuItemClick(this);
    }
  }

  setSelectedState(value: boolean): void {
    this.selected = value;
    this.selected$.next(value);
  }

  private updateRouterActive(): void {
    if (!this.listOfRouterLink || !this.router || !this.router.navigated || !this.matchRouter) {
      return;
    }
    Promise.resolve().then(() => {
      const hasActiveLinks = this.hasActiveLinks();
      if (this.selected !== hasActiveLinks) {
        this.selected = hasActiveLinks;
        this.setSelectedState(this.selected);
        this.cdr.markForCheck();
      }
    });
  }

  private hasActiveLinks(): boolean {
    const isActiveCheckFn = this.isLinkActive(this.router!);
    return (this.routerLink && isActiveCheckFn(this.routerLink)) || this.listOfRouterLink.some(isActiveCheckFn);
  }

  private isLinkActive(router: Router): (link: RouterLink) => boolean {
    return (link: RouterLink) =>
      router.isActive(link.urlTree || '', {
        paths: this.matchRouterExact ? 'exact' : 'subset',
        queryParams: this.matchRouterExact ? 'exact' : 'subset',
        fragment: 'ignored',
        matrixParams: 'ignored'
      });
  }

  constructor() {
    this.router?.events
      .pipe(
        takeUntilDestroyed(),
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(() => this.updateRouterActive());
  }

  ngOnInit(): void {
    /** store origin padding in padding */
    combineLatest([this.menuService.mode$, this.menuService.inlineIndent$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([mode, inlineIndent]) => {
        this.inlinePaddingLeft = mode === 'inline' ? this.level * inlineIndent : null;
      });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });
  }

  ngAfterContentInit(): void {
    this.listOfRouterLink.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateRouterActive());
    this.updateRouterActive();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzSelected } = changes;
    if (nzSelected) {
      this.setSelectedState(this.selected);
    }
  }
}
