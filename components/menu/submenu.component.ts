/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { CdkOverlayOrigin, ConnectedOverlayPositionChange, OverlayModule } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, merge } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { TriNoAnimationDirective } from 'ng-zorro-antd/core/animation';
import { getPlacementName, POSITION_MAP, POSITION_TYPE_HORIZONTAL } from 'ng-zorro-antd/core/overlay';

import { TriMenuItemComponent } from './menu-item.component';
import { MenuService } from './menu.service';
import { TriIsMenuInsideDropdownToken } from './menu.token';
import { TriMenuModeType, TriMenuThemeType, TriSubmenuTrigger } from './menu.types';
import { TriSubmenuInlineChildComponent } from './submenu-inline-child.component';
import { TriSubmenuNoneInlineChildComponent } from './submenu-non-inline-child.component';
import { TriSubMenuTitleComponent } from './submenu-title.component';
import { TriSubmenuService } from './submenu.service';

const listOfVerticalPositions = [
  POSITION_MAP.rightTop,
  POSITION_MAP.right,
  POSITION_MAP.rightBottom,
  POSITION_MAP.leftTop,
  POSITION_MAP.left,
  POSITION_MAP.leftBottom
];
const listOfHorizontalPositions = [
  POSITION_MAP.bottomLeft,
  POSITION_MAP.bottomRight,
  POSITION_MAP.topRight,
  POSITION_MAP.topLeft
];

@Component({
  selector: '[tri-submenu]',
  exportAs: 'triSubmenu',
  providers: [TriSubmenuService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      tri-submenu-title
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [icon]="icon"
      [title]="title"
      [mode]="mode"
      [disabled]="disabled"
      [isMenuInsideDropdown]="isMenuInsideDropdown"
      [paddingLeft]="paddingLeft || inlinePaddingLeft"
      [triggerSubMenuAction]="triggerSubMenuAction"
      (subMenuMouseState)="setMouseEnterState($event)"
      (toggleSubMenu)="toggleSubMenu()"
    >
      @if (!title) {
        <ng-content select="[title]" />
      }
    </div>
    @if (mode === 'inline') {
      <div
        tri-submenu-inline-child
        [mode]="mode"
        [open]="open"
        [@.disabled]="!!noAnimation?.nzNoAnimation?.()"
        [noAnimation]="noAnimation?.nzNoAnimation?.()"
        [menuClass]="menuClassName"
        [templateOutlet]="subMenuTemplate"
      ></div>
    } @else {
      <ng-template
        cdkConnectedOverlay
        (positionChange)="onPositionChange($event)"
        [cdkConnectedOverlayPositions]="overlayPositions"
        [cdkConnectedOverlayOrigin]="origin"
        [cdkConnectedOverlayWidth]="triggerWidth!"
        [cdkConnectedOverlayOpen]="open"
        [cdkConnectedOverlayTransformOriginOn]="'.ant-menu-submenu'"
        (overlayOutsideClick)="setMouseEnterState(false)"
      >
        <div
          tri-submenu-none-inline-child
          [theme]="theme"
          [mode]="mode"
          [open]="open"
          [position]="position"
          [disabled]="disabled"
          [isMenuInsideDropdown]="isMenuInsideDropdown"
          [triggerSubMenuAction]="triggerSubMenuAction"
          [templateOutlet]="subMenuTemplate"
          [menuClass]="menuClassName"
          [@.disabled]="!!noAnimation?.nzNoAnimation?.()"
          [noAnimation]="noAnimation?.nzNoAnimation?.()"
          (subMenuMouseState)="setMouseEnterState($event)"
        ></div>
      </ng-template>
    }

    <ng-template #subMenuTemplate>
      <ng-content />
    </ng-template>
  `,
  host: {
    '[class.tri-dropdown-menu-submenu]': `isMenuInsideDropdown`,
    '[class.tri-dropdown-menu-submenu-disabled]': `isMenuInsideDropdown && disabled`,
    '[class.tri-dropdown-menu-submenu-open]': `isMenuInsideDropdown && open`,
    '[class.tri-dropdown-menu-submenu-selected]': `isMenuInsideDropdown && isSelected`,
    '[class.tri-dropdown-menu-submenu-vertical]': `isMenuInsideDropdown && mode === 'vertical'`,
    '[class.tri-dropdown-menu-submenu-horizontal]': `isMenuInsideDropdown && mode === 'horizontal'`,
    '[class.tri-dropdown-menu-submenu-inline]': `isMenuInsideDropdown && mode === 'inline'`,
    '[class.tri-dropdown-menu-submenu-active]': `isMenuInsideDropdown && isActive`,
    '[class.tri-menu-submenu]': `!isMenuInsideDropdown`,
    '[class.tri-menu-submenu-disabled]': `!isMenuInsideDropdown && disabled`,
    '[class.tri-menu-submenu-open]': `!isMenuInsideDropdown && open`,
    '[class.tri-menu-submenu-selected]': `!isMenuInsideDropdown && isSelected`,
    '[class.tri-menu-submenu-vertical]': `!isMenuInsideDropdown && mode === 'vertical'`,
    '[class.tri-menu-submenu-horizontal]': `!isMenuInsideDropdown && mode === 'horizontal'`,
    '[class.tri-menu-submenu-inline]': `!isMenuInsideDropdown && mode === 'inline'`,
    '[class.tri-menu-submenu-active]': `!isMenuInsideDropdown && isActive`,
    '[class.tri-menu-submenu-rtl]': `dir === 'rtl'`
  },
  imports: [
    TriSubMenuTitleComponent,
    TriSubmenuInlineChildComponent,
    TriNoAnimationDirective,
    TriSubmenuNoneInlineChildComponent,
    OverlayModule
  ]
})
export class TriSubMenuComponent implements OnInit, AfterContentInit, OnChanges {
  public readonly submenuService = inject(TriSubmenuService);
  protected readonly isMenuInsideDropdown = inject(TriIsMenuInsideDropdownToken);
  protected readonly noAnimation = inject(TriNoAnimationDirective, { optional: true, host: true });
  private readonly directionality = inject(Directionality);
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuService = inject(MenuService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly platform = inject(Platform);

  @Input() menuClassName: string = '';
  @Input() paddingLeft: number | null = null;
  @Input() title: string | TemplateRef<void> | null = null;
  @Input() icon: string | null = null;
  @Input() triggerSubMenuAction: TriSubmenuTrigger = 'hover';
  @Input({ transform: booleanAttribute }) open = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() placement: POSITION_TYPE_HORIZONTAL = 'bottomLeft';
  @Output() readonly openChange = new EventEmitter<boolean>();
  @ViewChild(CdkOverlayOrigin, { static: true, read: ElementRef }) cdkOverlayOrigin: ElementRef | null = null;
  // fix errors about circular dependency
  // Can't construct a query for the property ... since the query selector wasn't defined
  @ContentChildren(forwardRef(() => TriSubMenuComponent), { descendants: true })
  listOfNzSubMenuComponent: QueryList<TriSubMenuComponent> | null = null;
  @ContentChildren(TriMenuItemComponent, { descendants: true })
  listOfNzMenuItemDirective: QueryList<TriMenuItemComponent> | null = null;

  private level = this.submenuService.level;
  position = 'right';
  triggerWidth: number | null = null;
  theme: TriMenuThemeType = 'light';
  mode: TriMenuModeType = 'vertical';
  inlinePaddingLeft: number | null = null;
  overlayPositions = listOfVerticalPositions;
  isSelected = false;
  isActive = false;
  dir: Direction = 'ltr';

  /** set the submenu host open status directly **/
  setOpenStateWithoutDebounce(open: boolean): void {
    this.submenuService.setOpenStateWithoutDebounce(open);
  }

  toggleSubMenu(): void {
    this.setOpenStateWithoutDebounce(!this.open);
  }

  setMouseEnterState(value: boolean): void {
    this.isActive = value;
    if (this.mode !== 'inline') {
      this.submenuService.setMouseEnterTitleOrOverlayState(value);
    }
  }

  setTriggerWidth(): void {
    if (
      this.mode === 'horizontal' &&
      this.platform.isBrowser &&
      this.cdkOverlayOrigin &&
      this.placement === 'bottomLeft'
    ) {
      /** TODO: fast dom */
      this.triggerWidth = this.cdkOverlayOrigin!.nativeElement.getBoundingClientRect().width;
    }
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    const placement = getPlacementName(position);
    if (placement === 'rightTop' || placement === 'rightBottom' || placement === 'right') {
      this.position = 'right';
    } else if (placement === 'leftTop' || placement === 'leftBottom' || placement === 'left') {
      this.position = 'left';
    }
  }

  ngOnInit(): void {
    /** submenu theme update **/
    this.menuService.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(theme => {
      this.theme = theme;
      this.cdr.markForCheck();
    });

    /** submenu mode update **/
    this.submenuService.mode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(mode => {
      this.mode = mode;
      if (mode === 'horizontal') {
        this.overlayPositions = [POSITION_MAP[this.placement], ...listOfHorizontalPositions];
      } else if (mode === 'vertical') {
        this.overlayPositions = listOfVerticalPositions;
      }
      this.cdr.markForCheck();
    });

    /** inlineIndent update **/
    combineLatest([this.submenuService.mode$, this.menuService.inlineIndent$])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([mode, inlineIndent]) => {
        this.inlinePaddingLeft = mode === 'inline' ? this.level * inlineIndent : null;
        this.cdr.markForCheck();
      });

    /** current submenu open status **/
    this.submenuService.isCurrentSubMenuOpen$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(open => {
      this.isActive = open;
      if (open !== this.open) {
        this.setTriggerWidth();
        this.open = open;
        this.openChange.emit(this.open);
        this.cdr.markForCheck();
      }
    });

    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.markForCheck();
    });
  }

  ngAfterContentInit(): void {
    this.setTriggerWidth();
    const listOfNzMenuItemDirective = this.listOfNzMenuItemDirective;
    const changes = listOfNzMenuItemDirective!.changes;
    const mergedObservable = merge(changes, ...listOfNzMenuItemDirective!.map(menu => menu.selected$));
    changes
      .pipe(
        startWith(listOfNzMenuItemDirective),
        switchMap(() => mergedObservable),
        startWith(true),
        map(() => listOfNzMenuItemDirective!.some(e => e.selected)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(selected => {
        this.isSelected = selected;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOpen } = changes;
    if (nzOpen) {
      this.submenuService.setOpenStateWithoutDebounce(this.open);
      this.setTriggerWidth();
    }
  }
}
