/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { ConnectedOverlayPositionChange, OverlayContainer } from '@angular/cdk/overlay';
import {
  Component,
  DebugElement,
  ElementRef,
  provideZoneChangeDetection,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { dispatchFakeEvent, provideMockDirectionality } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';
import { TriSubmenuTrigger } from 'ng-zorro-antd/menu/menu.types';

import { TriMenuItemComponent } from './menu-item.component';
import { TriMenuDirective } from './menu.directive';
import { TriMenuModule } from './menu.module';
import { TriSubMenuComponent } from './submenu.component';

describe('menu', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [
        provideNzIconsTesting(),
        provideNzNoAnimation(),
        provideZoneChangeDetection(),
        provideMockDirectionality()
      ]
    });
  });

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    oc.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('basic', () => {
    describe('horizontal', () => {
      let fixture: ComponentFixture<TriTestBasicMenuHorizontalComponent>;
      let items: DebugElement[];
      let submenu: DebugElement;
      let menu: DebugElement;
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestBasicMenuHorizontalComponent);
        items = fixture.debugElement.queryAll(By.directive(TriMenuItemComponent));
        submenu = fixture.debugElement.query(By.directive(TriSubMenuComponent));
        menu = fixture.debugElement.query(By.directive(TriMenuDirective));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(items.every(item => item.nativeElement.classList.contains('ant-menu-item'))).toBe(true);
        expect(items[1].nativeElement.classList.contains('ant-menu-item-disabled')).toBe(true);
        expect(submenu.nativeElement.classList.contains('ant-menu-submenu-horizontal')).toBe(true);
        expect(submenu.nativeElement.classList.contains('ant-menu-submenu')).toBe(true);
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-light ant-menu-horizontal');
      });

      it('should menu item select', () => {
        fixture.detectChanges();
        items[0].nativeElement.click();
        fixture.detectChanges();
        expect(items[0].nativeElement.classList.contains('ant-menu-item-selected')).toBe(true);
      });

      it('should menu disabled work', () => {
        fixture.detectChanges();
        items[1].nativeElement.click();
        fixture.detectChanges();
        expect(items[0].nativeElement.classList.contains('ant-menu-item-selected')).toBe(false);
      });

      it('should menu danger work', () => {
        fixture.detectChanges();
        expect(items[3].nativeElement.classList.contains('ant-menu-item-danger')).toBe(true);
      });
    });

    describe('inline', () => {
      let fixture: ComponentFixture<TriTestBasicMenuInlineComponent>;
      let items: DebugElement[];
      let submenus: DebugElement[];
      let menu: DebugElement;
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestBasicMenuInlineComponent);
        items = fixture.debugElement.queryAll(By.directive(TriMenuItemComponent));
        menu = fixture.debugElement.query(By.directive(TriMenuDirective));
        submenus = fixture.debugElement.queryAll(By.directive(TriSubMenuComponent));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(submenus.every(subitem => subitem.nativeElement.classList.contains('ant-menu-submenu'))).toBe(true);
        expect(submenus.every(subitem => subitem.nativeElement.classList.contains('ant-menu-submenu-inline'))).toBe(
          true
        );
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-light ant-menu-inline');
      });

      it('should padding left work', () => {
        fixture.detectChanges();
        const firstLevelItems = items;
        const secondLevelItems = firstLevelItems.splice(6, 2);
        expect(firstLevelItems.every(item => item.nativeElement.style.paddingLeft === '48px')).toBe(true);
        expect(secondLevelItems.every(item => item.nativeElement.style.paddingLeft === '72px')).toBe(true);
      });

      it('should click expand', fakeAsync(() => {
        fixture.detectChanges();
        const ul = submenus[0].nativeElement.querySelector('.ant-menu');
        const title = submenus[0].nativeElement.querySelector('.ant-menu-submenu-title');
        expect(ul.style.height).toBe('0px');
        title.click();
        fixture.detectChanges();
        tick(500);
        expect(ul.style.height).not.toBe('0px');
        expect(submenus[0].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(true);
        title.click();
        fixture.detectChanges();
        tick(500);
        expect(ul.style.height).toBe('0px');
        expect(submenus[0].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(false);
      }));
    });

    describe('inline-collapsed', () => {
      let fixture: ComponentFixture<TriTestMenuInlineCollapsedComponent>;
      let testComponent: TriTestMenuInlineCollapsedComponent;
      let submenus: DebugElement[];
      let menu: DebugElement;
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestMenuInlineCollapsedComponent);
        testComponent = fixture.debugElement.componentInstance;
        submenus = fixture.debugElement.queryAll(By.directive(TriSubMenuComponent));
        menu = fixture.debugElement.query(By.directive(TriMenuDirective));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-dark ant-menu-inline');
        testComponent.isCollapsed = true;
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe(
          'ant-menu ant-menu-root ant-menu-dark ant-menu-vertical ant-menu-inline-collapsed'
        );
        testComponent.isCollapsed = false;
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-dark ant-menu-inline');
      });

      it('should keep open after change mode', () => {
        fixture.detectChanges();
        let ul = submenus[0].nativeElement.querySelector('.ant-menu');
        const title = submenus[0].nativeElement.querySelector('.ant-menu-submenu-title');
        expect(ul.style.height).toBe('0px');
        testComponent.isCollapsed = true;
        fixture.detectChanges();
        testComponent.isCollapsed = false;
        fixture.detectChanges();
        ul = submenus[0].nativeElement.querySelector('.ant-menu');
        expect(ul.style.height).toBe('0px');
        title.click();
        fixture.detectChanges();
        expect(ul.style.height).not.toBe('0px');
        testComponent.isCollapsed = true;
        fixture.detectChanges();
        testComponent.isCollapsed = false;
        fixture.detectChanges();
        expect(ul.style.height).not.toBe('0px');
      });
    });

    describe('slider-current', () => {
      let fixture: ComponentFixture<TriTestMenuSiderCurrentComponent>;
      let submenus: DebugElement[];
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestMenuSiderCurrentComponent);
        submenus = fixture.debugElement.queryAll(By.directive(TriSubMenuComponent));
      });

      it('should collapsed self work', fakeAsync(() => {
        fixture.detectChanges();
        const ul = submenus[0].nativeElement.querySelector('.ant-menu');
        const title = submenus[0].nativeElement.querySelector('.ant-menu-submenu-title');
        expect(ul.style.height).not.toBe('0px');
        title.click();
        fixture.detectChanges();
        tick(500);
        expect(ul.style.height).toBe('0px');
        expect(submenus[0].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(false);
        title.click();
        fixture.detectChanges();
        tick(500);
        expect(ul.style.height).not.toBe('0px');
        expect(submenus[0].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(true);
      }));

      it('should collapsed other work', fakeAsync(() => {
        fixture.detectChanges();
        const firstUl = submenus[0].nativeElement.querySelector('.ant-menu');
        const secondUl = submenus[1].nativeElement.querySelector('.ant-menu');
        const secondTitle = submenus[1].nativeElement.querySelector('.ant-menu-submenu-title');
        expect(firstUl.style.height).not.toBe('0px');
        expect(submenus[0].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(true);
        secondTitle.click();
        fixture.detectChanges();
        tick(500);
        expect(firstUl.style.height).toBe('0px');
        expect(submenus[0].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(false);
        expect(secondUl.style.height).not.toBe('0px');
        expect(submenus[1].nativeElement.classList.contains('ant-menu-submenu-open')).toBe(true);
      }));
    });

    describe('theme', () => {
      let fixture: ComponentFixture<TriTestMenuThemeComponent>;
      let testComponent: TriTestMenuThemeComponent;
      let menu: DebugElement;
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestMenuThemeComponent);
        testComponent = fixture.debugElement.componentInstance;
        menu = fixture.debugElement.query(By.directive(TriMenuDirective));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-dark ant-menu-inline');
        testComponent.theme = false;
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-inline ant-menu-light');
      });
    });

    describe('switch-mode', () => {
      let fixture: ComponentFixture<TriTestMenuSwitchModeComponent>;
      let testComponent: TriTestMenuSwitchModeComponent;
      let submenus: DebugElement[];
      let menu: DebugElement;
      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestMenuSwitchModeComponent);
        testComponent = fixture.debugElement.componentInstance;
        submenus = fixture.debugElement.queryAll(By.directive(TriSubMenuComponent));
        menu = fixture.debugElement.query(By.directive(TriMenuDirective));
      });

      it('should className correct', () => {
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-light ant-menu-inline');
        expect(submenus.every(submenu => submenu.nativeElement.classList.contains('ant-menu-submenu-inline'))).toBe(
          true
        );
        testComponent.mode = true;
        fixture.detectChanges();
        expect(menu.nativeElement.className).toBe('ant-menu ant-menu-root ant-menu-light ant-menu-vertical');
        expect(submenus.every(submenu => submenu.nativeElement.classList.contains('ant-menu-submenu-inline'))).toBe(
          false
        );
        expect(submenus.every(submenu => submenu.nativeElement.classList.contains('ant-menu-submenu-vertical'))).toBe(
          true
        );
      });
    });
  });

  describe('submenu', () => {
    describe('horizontal submenu', () => {
      let fixture: ComponentFixture<TriTestMenuHorizontalComponent>;
      let testComponent: TriTestMenuHorizontalComponent;
      let submenu: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestMenuHorizontalComponent);
        testComponent = fixture.debugElement.componentInstance;
        submenu = fixture.debugElement.query(By.directive(TriSubMenuComponent));
      });

      it('should overlay work', fakeAsync(() => {
        fixture.detectChanges();
        expect(overlayContainerElement.textContent).toBe('');
        testComponent.open = true;
        fixture.detectChanges();
        expect(overlayContainerElement.textContent).not.toBe('');
      }));

      it('should submenu mouseenter work', () => {
        fixture.detectChanges();
        const mouseenterCallback = jasmine.createSpy('mouseenter callback');
        const subs = testComponent.subs.toArray();
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');

        (subs[0].submenuService as TriSafeAny).isMouseEnterTitleOrOverlay$.subscribe(mouseenterCallback);
        dispatchFakeEvent(title, 'mouseenter');
        fixture.detectChanges();
        expect(mouseenterCallback).toHaveBeenCalledWith(true);
        expect(mouseenterCallback).toHaveBeenCalledTimes(1);
      });

      it('should have "hover" as default trigger', () => {
        fixture.detectChanges();
        const mouseenterCallback = jasmine.createSpy('mouseenter callback');
        const subs = testComponent.subs.toArray();
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');

        (subs[0].submenuService as TriSafeAny).isMouseEnterTitleOrOverlay$.subscribe(mouseenterCallback);
        dispatchFakeEvent(title, 'mouseenter');
        fixture.detectChanges();
        expect(mouseenterCallback).toHaveBeenCalledWith(true);
        expect(mouseenterCallback).toHaveBeenCalledTimes(1);
      });

      it('should have not open with mouse hover if trigger is set to "click"', () => {
        testComponent.triggerSubMenuAction = 'click';
        fixture.detectChanges();
        const mouseenterCallback = jasmine.createSpy('mouseenter callback');
        const subs = testComponent.subs.toArray();
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');

        (subs[0].submenuService as TriSafeAny).isMouseEnterTitleOrOverlay$.subscribe(mouseenterCallback);
        dispatchFakeEvent(title, 'mouseenter');
        fixture.detectChanges();
        expect(mouseenterCallback).toHaveBeenCalledTimes(0);
      });

      it('should open with mouse click if trigger is set to "click"', () => {
        testComponent.triggerSubMenuAction = 'click';
        fixture.detectChanges();
        const mouseenterCallback = jasmine.createSpy('mouseenter callback');
        const subs = testComponent.subs.toArray();
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');
        (subs[0].submenuService as TriSafeAny).isMouseEnterTitleOrOverlay$.subscribe(mouseenterCallback);
        title.click();
        fixture.detectChanges();
        expect(mouseenterCallback).toHaveBeenCalledTimes(1);
      });

      it('should submenu mouseleave work', () => {
        fixture.detectChanges();
        const mouseleaveCallback = jasmine.createSpy('mouseleave callback');
        const subs = testComponent.subs.toArray();
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');

        (subs[0].submenuService as TriSafeAny).isMouseEnterTitleOrOverlay$.subscribe(mouseleaveCallback);
        dispatchFakeEvent(title, 'mouseleave');
        fixture.detectChanges();
        expect(mouseleaveCallback).toHaveBeenCalledWith(false);
        expect(mouseleaveCallback).toHaveBeenCalledTimes(1);
      });

      it('should nested submenu work', () => {
        testComponent.open = true;
        fixture.detectChanges();
        const nestedCallback = jasmine.createSpy('nested callback');
        const subs = testComponent.subs.toArray();

        (subs[0].submenuService as TriSafeAny).isChildSubMenuOpen$.subscribe(nestedCallback);
        subs[1].open = true;
        subs[1].submenuService.isCurrentSubMenuOpen$.next(false);
        fixture.detectChanges();
        expect(nestedCallback).toHaveBeenCalledWith(false);
        expect(nestedCallback).toHaveBeenCalledTimes(1);
      });

      it('should nested submenu disabled work', () => {
        testComponent.open = true;
        testComponent.disabled = true;
        fixture.detectChanges();
        const nestedCallback = jasmine.createSpy('nested callback');
        const subs = testComponent.subs.toArray();

        (subs[0].submenuService as TriSafeAny).isChildSubMenuOpen$.subscribe(nestedCallback);
        subs[1].open = true;
        subs[1].submenuService.isCurrentSubMenuOpen$.next(false);
        fixture.detectChanges();
        expect(nestedCallback).toHaveBeenCalledTimes(1);
      });

      it('should click menu and other submenu menu not active', fakeAsync(() => {
        testComponent.open = true;
        fixture.detectChanges();
        const subs = testComponent.subs.toArray();
        dispatchFakeEvent(testComponent.menuitem1.nativeElement, 'mouseenter');
        fixture.detectChanges();
        testComponent.menuitem1.nativeElement.click();
        fixture.detectChanges();
        tick(500);
        expect(subs[1].isActive).toBe(false);
      }));

      it('should click submenu menu item close', () => {
        testComponent.open = true;
        fixture.detectChanges();
        const nestedCallback = jasmine.createSpy('nested callback');
        const subs = testComponent.subs.toArray();
        subs[1].open = true;
        fixture.detectChanges();

        (subs[1].submenuService as TriSafeAny).isChildSubMenuOpen$.subscribe(nestedCallback);
        testComponent.menuitem.nativeElement.click();
        fixture.detectChanges();
        expect(nestedCallback).toHaveBeenCalledWith(false);
        expect(nestedCallback).toHaveBeenCalledTimes(1);
      });

      it('should click submenu disabled menu item not close', () => {
        testComponent.open = true;
        fixture.detectChanges();
        const nestedCallback = jasmine.createSpy('nested callback');
        const subs = testComponent.subs.toArray();

        (subs[1].submenuService as TriSafeAny).isMouseEnterTitleOrOverlay$.subscribe(nestedCallback);
        subs[1].open = true;
        testComponent.disabledItem.nativeElement.click();
        fixture.detectChanges();
        expect(nestedCallback).toHaveBeenCalledTimes(0);
      });

      it('should width change correct', () => {
        fixture.detectChanges();
        testComponent.open = true;
        fixture.detectChanges();
        const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
        expect(overlayPane.style.width).toBe('200px');
        testComponent.open = false;
        fixture.detectChanges();
        testComponent.width = 300;
        fixture.detectChanges();
        testComponent.open = true;
        fixture.detectChanges();
        expect(overlayPane.style.width).toBe('300px');
      });

      it('should position change correct', () => {
        const fakeLeftTopEvent = {
          connectionPair: {
            originX: 'start',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'top'
          }
        } as ConnectedOverlayPositionChange;
        const fakeRightTopEvent = {
          connectionPair: {
            originX: 'end',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'top'
          }
        } as ConnectedOverlayPositionChange;
        fixture.detectChanges();
        testComponent.open = true;
        const subs = testComponent.subs.toArray();
        subs[1].open = true;
        fixture.detectChanges();
        subs[1].onPositionChange(fakeLeftTopEvent);
        fixture.detectChanges();
        expect(subs[1].position).toBe('left');
        subs[1].onPositionChange(fakeRightTopEvent);
        fixture.detectChanges();
        expect(subs[1].position).toBe('right');
      });

      it('should `nzMenuClassName` work', fakeAsync(() => {
        fixture.detectChanges();
        testComponent.open = true;
        fixture.detectChanges();
        expect((overlayContainerElement.querySelector('.submenu') as HTMLUListElement).classList).toContain(
          'ant-menu-sub'
        );
      }));

      it('should nested submenu `nzMenuClassName` work', () => {
        testComponent.open = true;
        fixture.detectChanges();
        const subs = testComponent.subs.toArray();
        subs[0].open = true;
        subs[1].open = true;

        (subs[1] as TriSafeAny).cdr.markForCheck();
        fixture.detectChanges();
        expect((overlayContainerElement.querySelector('.nested-submenu') as HTMLUListElement).classList).toContain(
          'ant-menu-sub'
        );
      });
    });

    describe('inline submenu', () => {
      let fixture: ComponentFixture<TriTestMenuInlineComponent>;
      let testComponent: TriTestMenuInlineComponent;
      let submenu: DebugElement;

      beforeEach(() => {
        fixture = TestBed.createComponent(TriTestMenuInlineComponent);
        testComponent = fixture.debugElement.componentInstance;
        submenu = fixture.debugElement.query(By.directive(TriSubMenuComponent));
      });

      it('should click expand', fakeAsync(() => {
        fixture.detectChanges();
        const ul = submenu.nativeElement.querySelector('.ant-menu');
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');
        expect(ul.style.height).toBe('0px');
        title.click();
        fixture.detectChanges();
        tick(500);
        expect(ul.style.height).not.toBe('0px');
        expect(submenu.nativeElement.classList.contains('ant-menu-submenu-open')).toBe(true);
      }));

      it('should `nzMenuClassName` work', fakeAsync(() => {
        fixture.detectChanges();
        expect(submenu.nativeElement.querySelector('.ant-menu-sub').className).toContain('submenu');
      }));

      it('should `nzMenuClassName` multi class names work', fakeAsync(() => {
        fixture.detectChanges();
        testComponent.submenuClassName = 'submenu submenu-1';
        fixture.detectChanges();
        expect(submenu.nativeElement.querySelector('.ant-menu-sub').className).toContain('submenu');
        expect(submenu.nativeElement.querySelector('.ant-menu-sub').className).toContain('submenu-1');
      }));

      it('should disabled work', fakeAsync(() => {
        testComponent.disabled = true;
        fixture.detectChanges();
        const ul = submenu.nativeElement.querySelector('.ant-menu');
        const title = submenu.nativeElement.querySelector('.ant-menu-submenu-title');
        expect(ul.style.height).toBe('0px');
        title.click();
        fixture.detectChanges();
        tick(500);
        expect(ul.style.height).toBe('0px');
        expect(submenu.nativeElement.classList.contains('ant-menu-submenu-open')).toBe(false);
      }));
    });

    describe('submenu default selected', () => {
      it('should default selected active submenu', () => {
        const fixture = TestBed.createComponent(TriTestSubMenuSelectedComponent);
        fixture.detectChanges();
        expect(fixture.debugElement.nativeElement.querySelector('.ant-menu-submenu').classList).toContain(
          'ant-menu-submenu-selected'
        );
      });
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestMenuHorizontalComponent>;
    let testComponent: TriTestMenuHorizontalComponent;
    let submenu: DebugElement;
    let menu: DebugElement;
    let directionality: Directionality;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestMenuHorizontalComponent);
      testComponent = fixture.componentInstance;
      submenu = fixture.debugElement.query(By.directive(TriSubMenuComponent));
      menu = fixture.debugElement.query(By.directive(TriMenuDirective));
      directionality = TestBed.inject(Directionality);

      testComponent.open = true;
      directionality.valueSignal.set('rtl');
      fixture.detectChanges();
    });

    it('should className correct on dir change', () => {
      expect(submenu.nativeElement.classList.contains('ant-menu-submenu-rtl')).toBe(true);
      expect(menu.nativeElement.classList.contains('ant-menu-rtl')).toBe(true);

      directionality.valueSignal.set('ltr');
      fixture.detectChanges();

      expect(submenu.nativeElement.classList.contains('ant-menu-submenu-rtl')).toBe(false);
      expect(menu.nativeElement.classList.contains('ant-menu-rtl')).toBe(false);
    });

    it('should nested submenu work', () => {
      const subs = testComponent.subs.toArray();
      subs[0].open = true;
      fixture.detectChanges();

      expect((overlayContainerElement.querySelector('.ant-menu-submenu') as HTMLUListElement).classList).toContain(
        'ant-menu-submenu-rtl'
      );
    });
  });
});

@Component({
  selector: 'tri-test-menu-horizontal',
  imports: [TriIconModule, TriMenuModule],
  template: `
    <ul tri-menu mode="horizontal">
      <li
        tri-submenu
        [triggerSubMenuAction]="triggerSubMenuAction"
        menuClassName="submenu"
        [open]="open"
        [style.width.px]="width"
      >
        <span title>
          <tri-icon type="setting" />
          Navigation Three - Submenu
        </span>
        <ul>
          <li tri-menu-group>
            <span title>Item 1</span>
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group>
            <span title>Item 2</span>
            <ul>
              <li tri-menu-item #menuitem1>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu menuClassName="nested-submenu" [disabled]="disabled">
                <span title>Sub Menu</span>
                <ul>
                  <li tri-menu-item #menuitem>Option 5</li>
                  <li tri-menu-item #disabledItem disabled>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled>
                <span title>Disabled Sub Menu</span>
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestMenuHorizontalComponent {
  width = 200;
  open = false;
  disabled = false;
  triggerSubMenuAction: TriSubmenuTrigger = 'hover';
  @ViewChildren(TriSubMenuComponent) subs!: QueryList<TriSubMenuComponent>;
  @ViewChild('menuitem', { static: false, read: ElementRef }) menuitem!: ElementRef;
  @ViewChild('menuitem1', { static: false, read: ElementRef }) menuitem1!: ElementRef;
  @ViewChild('disabledItem', { static: false, read: ElementRef }) disabledItem!: ElementRef;
}

@Component({
  imports: [TriIconModule, TriMenuModule],
  template: `
    <ul tri-menu mode="inline" [inlineCollapsed]="collapse">
      <li tri-submenu [menuClassName]="submenuClassName" [disabled]="disabled">
        <span title>
          <tri-icon type="mail" />
          Navigation One
        </span>
        <ul>
          <li tri-menu-item style="padding-left:0">Option 1</li>
          <li tri-menu-item>Option 2</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestMenuInlineComponent {
  disabled = false;
  collapse = false;
  submenuClassName = 'submenu';
  @ViewChild(TriSubMenuComponent, { static: true }) submenu!: TriSubMenuComponent;
}

@Component({
  imports: [TriIconModule, TriMenuModule],
  template: `
    <ul tri-menu mode="horizontal">
      <li tri-menu-item>
        <tri-icon type="mail" />
        Navigation One
      </li>
      <li tri-menu-item disabled>
        <tri-icon type="appstore" />
        Navigation Two
      </li>
      <li tri-submenu title="Navigation Three - Submenu" icon="setting">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-menu-item>
        <a href="https://ng.ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
      </li>
      <li tri-menu-item danger>Navigation Five</li>
    </ul>
  `
})
export class TriTestBasicMenuHorizontalComponent {}

@Component({
  imports: [TriMenuModule],
  template: `
    <ul tri-menu mode="inline">
      <li tri-submenu title="Navigation One" icon="mail">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Two" icon="appstore">
        <ul>
          <li tri-menu-item>Option 5</li>
          <li tri-menu-item>Option 6</li>
          <li tri-submenu title="Submenu">
            <ul>
              <li tri-menu-item>Option 7</li>
              <li tri-menu-item>Option 8</li>
              <li tri-submenu title="Submenu">
                <ul>
                  <li tri-menu-item>Option 9</li>
                  <li tri-menu-item>Option 10</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Three" icon="setting">
        <ul>
          <li tri-menu-item>Option 11</li>
          <li tri-menu-item>Option 12</li>
          <li tri-menu-item>Option 13</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestBasicMenuInlineComponent {}

// https://github.com/NG-ZORRO/ng-zorro-antd/issues/3345
@Component({
  imports: [TriIconModule, TriMenuModule],
  template: `
    <ul tri-menu mode="inline" theme="dark" inlineCollapsed>
      <li tri-menu-item>
        <tri-icon type="mail" />
        <span>Navigation One</span>
      </li>
      <li tri-submenu title="Navigation Two" icon="appstore">
        <ul>
          <li tri-menu-item selected>Option 5</li>
          <li tri-menu-item>Option 6</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestSubMenuSelectedComponent {}

@Component({
  imports: [TriButtonModule, TriIconModule, TriMenuModule],
  template: `
    <div class="wrapper">
      <button tri-button type="primary" (click)="toggleCollapsed()">
        <tri-icon [type]="isCollapsed ? 'menu-unfold' : 'menu-fold'" />
      </button>
      <ul tri-menu mode="inline" theme="dark" [inlineCollapsed]="isCollapsed">
        <li tri-menu-item selected>
          <tri-icon type="mail" />
          <span>Navigation One</span>
        </li>
        <li tri-submenu title="Navigation Two" icon="appstore">
          <ul>
            <li tri-menu-item>Option 5</li>
            <li tri-menu-item>Option 6</li>
            <li tri-submenu title="Submenu">
              <ul>
                <li tri-menu-item>Option 7</li>
                <li tri-menu-item>Option 8</li>
              </ul>
            </li>
          </ul>
        </li>
        <li tri-submenu title="Navigation Three" icon="setting">
          <ul>
            <li tri-menu-item>Option 9</li>
            <li tri-menu-item>Option 10</li>
            <li tri-menu-item>Option 11</li>
          </ul>
        </li>
      </ul>
    </div>
  `
})
export class TriTestMenuInlineCollapsedComponent {
  isCollapsed = false;

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

@Component({
  imports: [TriMenuModule],
  template: `
    <ul tri-menu mode="inline" style="width: 240px;">
      <li
        tri-submenu
        [(openChange)]="openMap.sub1"
        (openChange)="openHandler('sub1')"
        title="Navigation One"
        icon="mail"
      >
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li
        tri-submenu
        [(openChange)]="openMap.sub2"
        (openChange)="openHandler('sub2')"
        title="Navigation Two"
        icon="appstore"
      >
        <ul>
          <li tri-menu-item>Option 5</li>
          <li tri-menu-item>Option 6</li>
          <li tri-submenu title="Submenu">
            <ul>
              <li tri-menu-item>Option 7</li>
              <li tri-menu-item>Option 8</li>
            </ul>
          </li>
        </ul>
      </li>
      <li
        tri-submenu
        [(openChange)]="openMap.sub3"
        (openChange)="openHandler('sub3')"
        title="Navigation Three"
        icon="setting"
      >
        <ul>
          <li tri-menu-item>Option 9</li>
          <li tri-menu-item>Option 10</li>
          <li tri-menu-item>Option 11</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestMenuSiderCurrentComponent {
  openMap: Record<string, boolean> = {
    sub1: true,
    sub2: false,
    sub3: false
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}

@Component({
  imports: [TriMenuModule],
  template: `
    <ul tri-menu [mode]="mode ? 'vertical' : 'inline'" [theme]="dark ? 'dark' : 'light'">
      <li tri-submenu title="Navigation One" icon="mail">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Two" icon="appstore">
        <ul>
          <li tri-menu-item>Option 5</li>
          <li tri-menu-item>Option 6</li>
          <li tri-submenu title="Submenu">
            <ul>
              <li tri-menu-item>Option 7</li>
              <li tri-menu-item>Option 8</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Three" icon="setting">
        <ul>
          <li tri-menu-item>Option 9</li>
          <li tri-menu-item>Option 10</li>
          <li tri-menu-item>Option 11</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestMenuSwitchModeComponent {
  mode = false;
  dark = false;
}

@Component({
  imports: [TriMenuModule],
  template: `
    <ul tri-menu mode="inline" style="width: 240px;" [theme]="theme ? 'dark' : 'light'">
      <li tri-submenu open title="Navigation One" icon="mail">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item selected>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Two" icon="appstore">
        <ul>
          <li tri-menu-item>Option 5</li>
          <li tri-menu-item>Option 6</li>
          <li tri-submenu title="Submenu">
            <ul>
              <li tri-menu-item>Option 7</li>
              <li tri-menu-item>Option 8</li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Three" icon="setting">
        <ul>
          <li tri-menu-item>Option 9</li>
          <li tri-menu-item>Option 10</li>
          <li tri-menu-item>Option 11</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriTestMenuThemeComponent {
  theme = true;
}
