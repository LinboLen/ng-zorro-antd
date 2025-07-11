/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/** get some code from https://github.com/angular/material2 */

import { A11yModule } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  forwardRef,
  HOST_TAG_NAME,
  inject,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { merge, Observable, of, Subscription } from 'rxjs';
import { delay, filter, first, startWith } from 'rxjs/operators';

import { TriConfigKey, TriConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { PREFIX, warn } from 'ng-zorro-antd/core/logger';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';
import { wrapIntoObservable } from 'ng-zorro-antd/core/util';

import {
  TriAnimatedInterface,
  TriTabChangeEvent,
  TriTabPosition,
  TriTabPositionMode,
  TriTabsCanDeactivateFn,
  TriTabScrollEvent,
  TriTabType
} from './interfaces';
import { TriTabBarExtraContentDirective } from './tab-bar-extra-content.directive';
import { TriTabBodyComponent } from './tab-body.component';
import { TriTabCloseButtonComponent } from './tab-close-button.component';
import { TriTabLinkDirective } from './tab-link.directive';
import { TriTabNavBarComponent } from './tab-nav-bar.component';
import { TriTabNavItemDirective } from './tab-nav-item.directive';
import { TRI_TAB_SET, TriTabComponent } from './tab.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'tabs';

let nextId = 0;

@Component({
  selector: 'tri-tabs,tri-tabset',
  exportAs: 'triTabs',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    {
      provide: TRI_TAB_SET,
      useExisting: forwardRef(() => TriTabsComponent)
    }
  ],
  template: `
    @if (tabs.length || addable) {
      <tri-tabs-nav
        [style]="tabBarStyle"
        [selectedIndex]="selectedIndex || 0"
        [inkBarAnimated]="inkBarAnimated"
        [addable]="addable"
        [addIcon]="addIcon"
        [hideBar]="hideAll"
        [position]="position"
        [extraTemplate]="tabBarExtraContent"
        [extraContents]="extraContents()"
        (tabScroll)="tabListScroll.emit($event)"
        (selectFocusedIndex)="setSelectedIndex($event)"
        (addClicked)="onAdd()"
      >
        @for (tab of tabs; track tab; let i = $index) {
          <div
            class="tri-tabs-tab"
            [style.margin-right.px]="position === 'horizontal' ? tabBarGutter : null"
            [style.margin-bottom.px]="position === 'vertical' ? tabBarGutter : null"
            [class.tri-tabs-tab-active]="selectedIndex === i"
            [class.tri-tabs-tab-disabled]="disabled"
            (click)="clickNavItem(tab, i, $event)"
            (contextmenu)="contextmenuNavItem(tab, $event)"
          >
            <button
              type="button"
              role="tab"
              [id]="getTabContentId(i)"
              [attr.tabIndex]="getTabIndex(tab, i)"
              [attr.aria-disabled]="disabled"
              [attr.aria-selected]="selectedIndex === i && !hideAll"
              [attr.aria-controls]="getTabContentId(i)"
              [disabled]="disabled"
              [tab]="tab"
              [active]="selectedIndex === i"
              class="tri-tabs-tab-btn"
              tabNavItem
              cdkMonitorElementFocus
            >
              <ng-container *stringTemplateOutlet="tab.label; stringTemplateOutletContext: { visible: true }">
                {{ tab.label }}
              </ng-container>
              @if (closable && closable && !disabled) {
                <button
                  type="button"
                  tri-tab-close-button
                  [closeIcon]="closeIcon"
                  (click)="onClose(i, $event)"
                ></button>
              }
            </button>
          </div>
        }
      </tri-tabs-nav>
    }
    <div class="tri-tabs-content-holder">
      <div
        class="tri-tabs-content"
        [class.tri-tabs-content-top]="tabPosition === 'top'"
        [class.tri-tabs-content-bottom]="tabPosition === 'bottom'"
        [class.tri-tabs-content-left]="tabPosition === 'left'"
        [class.tri-tabs-content-right]="tabPosition === 'right'"
        [class.tri-tabs-content-animated]="tabPaneAnimated"
      >
        @if (!hideAll) {
          @for (tab of tabs; track tab; let i = $index) {
            @if (forceRender) {
              <ng-template [ngTemplateOutlet]="tabpaneTmpl"></ng-template>
            } @else if (destroyInactiveTabPane) {
              @if (selectedIndex === i) {
                <ng-template [ngTemplateOutlet]="tabpaneTmpl"></ng-template>
              }
            } @else {
              @if (selectedIndex === i || tab.hasBeenActive) {
                <ng-template [ngTemplateOutlet]="tabpaneTmpl"></ng-template>
              }
            }

            <ng-template #tabpaneTmpl>
              <div
                role="tabpanel"
                [id]="getTabContentId(i)"
                [attr.aria-labelledby]="getTabContentId(i)"
                tri-tab-body
                [active]="selectedIndex === i"
                [content]="tab.content"
                [animated]="tabPaneAnimated"
              ></div>
            </ng-template>
          }
        }
      </div>
    </div>
  `,
  host: {
    class: 'tri-tabs',
    '[class.tri-tabs-card]': `type === 'card' || type === 'editable-card'`,
    '[class.tri-tabs-editable]': `type === 'editable-card'`,
    '[class.tri-tabs-editable-card]': `type === 'editable-card'`,
    '[class.tri-tabs-centered]': `centered`,
    '[class.tri-tabs-rtl]': `dir === 'rtl'`,
    '[class.tri-tabs-top]': `tabPosition === 'top'`,
    '[class.tri-tabs-bottom]': `tabPosition === 'bottom'`,
    '[class.tri-tabs-left]': `tabPosition === 'left'`,
    '[class.tri-tabs-right]': `tabPosition === 'right'`,
    '[class.tri-tabs-default]': `size === 'default'`,
    '[class.tri-tabs-small]': `size === 'small'`,
    '[class.tri-tabs-large]': `size === 'large'`
  },
  imports: [
    TriTabNavBarComponent,
    NgTemplateOutlet,
    TriTabNavItemDirective,
    A11yModule,
    TriOutletModule,
    TriTabCloseButtonComponent,
    TriTabBodyComponent
  ]
})
export class TriTabsComponent implements OnInit, AfterContentChecked, AfterContentInit {
  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  public configService = inject(TriConfigService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @Input()
  get selectedIndex(): number | null {
    return this.#selectedIndex;
  }
  set selectedIndex(value: null | number) {
    this.indexToSelect = coerceNumberProperty(value, null);
  }
  @Input() tabPosition: TriTabPosition = 'top';
  @Input() tabBarExtraContent?: TemplateRef<void>;
  @Input() canDeactivate: TriTabsCanDeactivateFn | null = null;
  @Input() addIcon: string | TemplateRef<TriSafeAny> = 'plus';
  @Input() tabBarStyle: Record<string, string> | null = null;
  @Input() @WithConfig() type: TriTabType = 'line';
  @Input() @WithConfig() size: TriSizeLDSType = 'default';
  @Input() @WithConfig() animated: TriAnimatedInterface | boolean = true;
  @Input() @WithConfig() tabBarGutter?: number = undefined;
  @Input({ transform: booleanAttribute }) hideAdd: boolean = false;
  @Input({ transform: booleanAttribute }) centered: boolean = false;
  @Input({ transform: booleanAttribute }) hideAll = false;
  @Input({ transform: booleanAttribute }) linkRouter = false;
  @Input({ transform: booleanAttribute }) linkExact = true;
  @Input({ transform: booleanAttribute }) destroyInactiveTabPane = false;

  @Output() readonly selectChange: EventEmitter<TriTabChangeEvent> = new EventEmitter<TriTabChangeEvent>(true);
  @Output() readonly selectedIndexChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() readonly tabListScroll = new EventEmitter<TriTabScrollEvent>();
  @Output() readonly close = new EventEmitter<{ index: number }>();
  @Output() readonly add = new EventEmitter<void>();

  get position(): TriTabPositionMode {
    return ['top', 'bottom'].indexOf(this.tabPosition) === -1 ? 'vertical' : 'horizontal';
  }

  get addable(): boolean {
    return this.type === 'editable-card' && !this.hideAdd;
  }

  get closable(): boolean {
    return this.type === 'editable-card';
  }

  get line(): boolean {
    return this.type === 'line';
  }

  get inkBarAnimated(): boolean {
    return this.line && (typeof this.animated === 'boolean' ? this.animated : this.animated.inkBar);
  }

  get tabPaneAnimated(): boolean {
    return typeof this.animated === 'boolean' ? this.animated : this.animated.tabPane;
  }

  // Pick up only direct descendants under ivy rendering engine
  // We filter out only the tabs that belong to this tab set in `tabs`.
  @ContentChildren(TriTabComponent, { descendants: true })
  allTabs: QueryList<TriTabComponent> = new QueryList<TriTabComponent>();

  @ContentChildren(TriTabLinkDirective, { descendants: true })
  tabLinks: QueryList<TriTabLinkDirective> = new QueryList<TriTabLinkDirective>();
  @ViewChild(TriTabNavBarComponent, { static: false }) tabNavBarRef!: TriTabNavBarComponent;
  // All the direct tabs for this tab set
  tabs: QueryList<TriTabComponent> = new QueryList<TriTabComponent>();

  readonly extraContents = contentChildren(TriTabBarExtraContentDirective);

  dir: Direction = 'ltr';
  private readonly tabSetId!: number;
  private indexToSelect: number | null = 0;
  #selectedIndex: number | null = null;
  private tabLabelSubscription = Subscription.EMPTY;
  private canDeactivateSubscription = Subscription.EMPTY;
  private router = inject(Router, { optional: true });

  constructor() {
    this.tabSetId = nextId++;

    // TODO: Remove this warning in 21.0.0
    if (inject(HOST_TAG_NAME) === 'nz-tabset') {
      warn(`${PREFIX} <nz-tabset> is deprecated, please use <nz-tabs> instead.`);
    }

    this.destroyRef.onDestroy(() => {
      this.tabs.destroy();
      this.tabLabelSubscription.unsubscribe();
      this.canDeactivateSubscription.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });
  }

  ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      Promise.resolve().then(() => this.setUpRouter());
    });

    this.subscribeToTabLabels();
    this.subscribeToAllTabChanges();

    // Subscribe to changes of the number of tabs, to be
    // able to re-render the content as new tabs are added or removed.
    this.tabs.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      const indexToSelect = this.clampTabIndex(this.indexToSelect);

      // Maintain the previously selected tab if a new tab is added or removed, and there is no
      // explicit change that selects a different tab.
      if (indexToSelect === this.#selectedIndex) {
        const tabs = this.tabs.toArray();

        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].isActive) {
            // Assign both to the `indexToSelect` and `selectedIndex` so we don't fire a changed
            // event, otherwise the consumer may end up in an infinite loop in some edge cases like
            // adding a tab within the `nzSelectedIndexChange` event.
            this.indexToSelect = this.#selectedIndex = i;
            break;
          }
        }
      }
      this.subscribeToTabLabels();
      this.cdr.markForCheck();
    });
  }

  ngAfterContentChecked(): void {
    // Don't clamp the `indexToSelect` immediately in the setter because it can happen that
    // the amount of tabs changes before the actual change detection runs.
    const indexToSelect = (this.indexToSelect = this.clampTabIndex(this.indexToSelect));

    // If there is a change in the selected index, emit a change event. Should not trigger if
    // the selected index has not yet been initialized.
    if (this.#selectedIndex !== indexToSelect) {
      const isFirstRun = this.#selectedIndex == null;

      if (!isFirstRun) {
        this.selectChange.emit(this.createChangeEvent(indexToSelect));
      }

      // Changing these values after change detection has run
      // since the checked content may contain references to them.
      Promise.resolve().then(() => {
        this.tabs.forEach((tab, index) => tab.setActive(index === indexToSelect));

        if (!isFirstRun) {
          this.selectedIndexChange.emit(indexToSelect);
        }
      });
    }

    // Set up the position for each tab and optionally set up an origin on the next selected tab.
    this.tabs.forEach((tab, index) => {
      tab.position = index - indexToSelect;

      // If there is already a selected tab, then set up an origin for the next selected tab
      // if it doesn't have one already.
      if (this.#selectedIndex != null && tab.position === 0 && !tab.origin) {
        tab.origin = indexToSelect - this.#selectedIndex;
      }
    });

    if (this.#selectedIndex !== indexToSelect) {
      this.#selectedIndex = indexToSelect;
      this.cdr.markForCheck();
    }
  }

  onClose(index: number, e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.close.emit({ index });
  }

  onAdd(): void {
    this.add.emit();
  }

  private clampTabIndex(index: number | null): number {
    return Math.min(this.tabs.length - 1, Math.max(index || 0, 0));
  }

  private createChangeEvent(index: number): TriTabChangeEvent {
    const event = new TriTabChangeEvent();
    event.index = index;
    if (this.tabs && this.tabs.length) {
      event.tab = this.tabs.toArray()[index];
      this.tabs.forEach((tab, i) => {
        if (i !== index) {
          tab.deselect.emit();
        }
      });
      event.tab.nzSelect.emit();
    }
    return event;
  }

  private subscribeToTabLabels(): void {
    if (this.tabLabelSubscription) {
      this.tabLabelSubscription.unsubscribe();
    }

    this.tabLabelSubscription = merge(...this.tabs.map(tab => tab.stateChanges)).subscribe(() =>
      this.cdr.markForCheck()
    );
  }

  private subscribeToAllTabChanges(): void {
    this.allTabs.changes.pipe(startWith(this.allTabs)).subscribe((tabs: QueryList<TriTabComponent>) => {
      this.tabs.reset(tabs.filter(tab => tab.closestTabSet === this));
      this.tabs.notifyOnChanges();
    });
  }

  canDeactivateFun(pre: number, next: number): Observable<boolean> {
    if (typeof this.canDeactivate === 'function') {
      const observable = wrapIntoObservable(this.canDeactivate(pre, next));
      return observable.pipe(first(), takeUntilDestroyed(this.destroyRef));
    } else {
      return of(true);
    }
  }

  clickNavItem(tab: TriTabComponent, index: number, e: MouseEvent): void {
    if (!tab.disabled) {
      // ignore nzCanDeactivate
      tab.click.emit();
      if (!this.isRouterLinkClickEvent(index, e)) {
        this.setSelectedIndex(index);
      }
    }
  }

  private isRouterLinkClickEvent(index: number, event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    if (this.linkRouter) {
      return !!this.tabs.toArray()[index]?.linkDirective?.elementRef.nativeElement.contains(target);
    } else {
      return false;
    }
  }

  contextmenuNavItem(tab: TriTabComponent, e: MouseEvent): void {
    if (!tab.disabled) {
      // ignore nzCanDeactivate
      tab.contextmenu.emit(e);
    }
  }

  setSelectedIndex(index: number): void {
    this.canDeactivateSubscription.unsubscribe();
    this.canDeactivateSubscription = this.canDeactivateFun(this.#selectedIndex!, index).subscribe(can => {
      if (can) {
        this.selectedIndex = index;
        this.tabNavBarRef.focusIndex = index;
        this.cdr.markForCheck();
      }
    });
  }

  getTabIndex(tab: TriTabComponent, index: number): number | null {
    if (tab.disabled) {
      return null;
    }
    return this.#selectedIndex === index ? 0 : -1;
  }

  getTabContentId(i: number): string {
    return `nz-tabs-${this.tabSetId}-tab-${i}`;
  }

  private setUpRouter(): void {
    if (this.linkRouter) {
      if (!this.router) {
        throw new Error(`${PREFIX} you should import 'RouterModule' if you want to use 'nzLinkRouter'!`);
      }
      merge(this.router.events.pipe(filter(e => e instanceof NavigationEnd)), this.tabLinks.changes)
        .pipe(startWith(true), delay(0), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.updateRouterActive();
          this.cdr.markForCheck();
        });
    }
  }

  private updateRouterActive(): void {
    if (this.router?.navigated) {
      const index = this.findShouldActiveTabIndex();
      if (index !== this.#selectedIndex) {
        this.setSelectedIndex(index);
      }
      Promise.resolve().then(() => (this.hideAll = index === -1));
    }
  }

  private findShouldActiveTabIndex(): number {
    const tabs = this.tabs.toArray();
    const isActive = this.isLinkActive(this.router);

    return tabs.findIndex(tab => {
      const c = tab.linkDirective;
      return c ? isActive(c.routerLink) : false;
    });
  }

  private isLinkActive(router: Router | null): (link?: RouterLink | null) => boolean {
    return (link?: RouterLink | null) =>
      link
        ? !!router?.isActive(link.urlTree || '', {
            paths: this.linkExact ? 'exact' : 'subset',
            queryParams: this.linkExact ? 'exact' : 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored'
          })
        : false;
  }
}

/**
 * @deprecated Use `NzTabsComponent` instead. This will be removed in 21.0.0.
 */
export const NzTabSetComponent = TriTabsComponent;
