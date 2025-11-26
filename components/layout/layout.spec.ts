/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { Component, DebugElement, provideZoneChangeDetection, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { provideNzIconsTesting } from 'ng-zorro-antd/icon/testing';

import { TriContentComponent } from './content.component';
import { TriFooterComponent } from './footer.component';
import { TriHeaderComponent } from './header.component';
import { TriLayoutComponent } from './layout.component';
import { TriLayoutModule } from './layout.module';
import { TriSiderComponent } from './sider.component';

declare const viewport: TriSafeAny;

describe('nz-layout', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<TriLayoutBasicComponent>;
    let headers: DebugElement[];
    let contents: DebugElement[];
    let footers: DebugElement[];
    let siders: DebugElement[];
    let layouts: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriLayoutBasicComponent);
      headers = fixture.debugElement.queryAll(By.directive(TriHeaderComponent));
      contents = fixture.debugElement.queryAll(By.directive(TriContentComponent));
      footers = fixture.debugElement.queryAll(By.directive(TriFooterComponent));
      siders = fixture.debugElement.queryAll(By.directive(TriSiderComponent));
      layouts = fixture.debugElement.queryAll(By.directive(TriLayoutComponent));
    });

    it('should have correct class', () => {
      fixture.detectChanges();
      expect(headers.every(header => header.nativeElement.classList.contains('ant-layout-header'))).toBe(true);
      expect(layouts.every(layout => layout.nativeElement.classList.contains('ant-layout'))).toBe(true);
      expect(contents.every(content => content.nativeElement.classList.contains('ant-layout-content'))).toBe(true);
      expect(footers.every(footer => footer.nativeElement.classList.contains('ant-layout-footer'))).toBe(true);
      expect(siders.every(sider => sider.nativeElement.classList.contains('ant-layout-sider'))).toBe(true);
      expect(
        siders.every(
          sider =>
            sider.nativeElement.style.cssText === 'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
        )
      ).toBe(true);
      expect(layouts[2].nativeElement.classList.contains('ant-layout-has-sider')).toBe(true);
      expect(layouts[4].nativeElement.classList.contains('ant-layout-has-sider')).toBe(true);
      expect(layouts[5].nativeElement.classList.contains('ant-layout-has-sider')).toBe(true);
    });
  });

  describe('side', () => {
    let fixture: ComponentFixture<TriLayoutSideComponent>;
    let testComponent: TriLayoutSideComponent;
    let sider: DebugElement;
    let trigger: DebugElement;

    beforeEach(() => {
      // todo: use zoneless
      TestBed.configureTestingModule({
        providers: [provideZoneChangeDetection()]
      });
      fixture = TestBed.createComponent(TriLayoutSideComponent);
      testComponent = fixture.componentInstance;
      sider = fixture.debugElement.query(By.directive(TriSiderComponent));
    });

    it('should nzCollapsed work', () => {
      testComponent.isCollapsed = false;
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 200px;').toBe(true);
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed).toBe(true);
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 80px;').toBe(true);
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed).toBe(false);
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 200px;').toBe(true);
      testComponent.isCollapsed = true;
      fixture.detectChanges();
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 80px;').toBe(true);
      testComponent.isCollapsed = false;
      fixture.detectChanges();
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 200px;').toBe(true);
    });

    it('should nzWidth work', () => {
      testComponent.isCollapsed = false;
      testComponent.width = 300;
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 300px; max-width: 300px; min-width: 300px; width: 300px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 300px;').toBe(true);
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed).toBe(true);
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 80px;').toBe(true);
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed).toBe(false);
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 300px; max-width: 300px; min-width: 300px; width: 300px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 300px;').toBe(true);
      testComponent.isCollapsed = true;
      fixture.detectChanges();
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 80px;').toBe(true);
      testComponent.isCollapsed = false;
      fixture.detectChanges();
      expect(
        sider.nativeElement.style.cssText === 'flex: 0 0 300px; max-width: 300px; min-width: 300px; width: 300px;'
      ).toBe(true);
      expect(trigger.nativeElement.style.cssText === 'width: 300px;').toBe(true);
    });

    it('should nzReverseArrow work', () => {
      testComponent.isCollapsed = false;
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-left')).toBe(true);
      testComponent.isCollapsed = true;
      fixture.detectChanges();
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-right')).toBe(true);
      testComponent.isReverseArrow = true;
      testComponent.isCollapsed = false;
      fixture.detectChanges();
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-right')).toBe(true);
      testComponent.isCollapsed = true;
      fixture.detectChanges();
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-left')).toBe(true);
    });
  });

  describe('custom-trigger', () => {
    let fixture: ComponentFixture<TriLayoutCustomTriggerComponent>;
    let testComponent: TriLayoutCustomTriggerComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNzIconsTesting()]
      });
      fixture = TestBed.createComponent(TriLayoutCustomTriggerComponent);
      testComponent = fixture.componentInstance;
    });

    it('should not display trigger', () => {
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(trigger).toBeNull();
    });

    it('should display trigger', () => {
      testComponent.changeTrigger();
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-up')).toBe(true);
      expect(trigger).not.toBeNull();
    });
  });

  describe('responsive', () => {
    let fixture: ComponentFixture<TriLayoutResponsiveComponent>;
    let sider: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideNzIconsTesting()]
      });
      fixture = TestBed.createComponent(TriLayoutResponsiveComponent);
      sider = fixture.debugElement.query(By.directive(TriSiderComponent));
    });

    it('should responsive work', fakeAsync(() => {
      viewport.set(500);
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      discardPeriodicTasks();
      fixture.detectChanges();
      expect(sider.nativeElement.style.cssText).toBe('flex: 0 0 0px; max-width: 0px; min-width: 0px; width: 0px;');
      expect(
        sider.nativeElement
          .querySelector('.ant-layout-sider-zero-width-trigger')
          .firstElementChild.getAttribute('nzType')
      ).toBe('menu-fold');
      viewport.reset();
    }));
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriTestLayoutRtlComponent>;
    let layouts: DebugElement[];

    beforeEach(() => {
      // todo: use zoneless
      TestBed.configureTestingModule({
        providers: [provideZoneChangeDetection()]
      });
      fixture = TestBed.createComponent(TriTestLayoutRtlComponent);
      layouts = fixture.debugElement.queryAll(By.directive(TriLayoutComponent));
    });

    it('should className correct on dir change', fakeAsync(() => {
      fixture.detectChanges();
      expect(layouts.every(layout => layout.nativeElement.classList.contains('ant-layout-rtl'))).toBe(true);

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();

      expect(layouts.every(layout => layout.nativeElement.classList.contains('ant-layout-rtl'))).toBe(false);
    }));
  });
});

@Component({
  imports: [TriIconModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider collapsible [(collapsedChange)]="isCollapsed" [trigger]="triggerTemplate"></tri-sider>
      <tri-layout>
        <tri-header>
          <span
            class="trigger"
            tri-icon
            [type]="isCollapsed ? 'menu-unfold' : 'menu-fold'"
            (click)="isCollapsed = !isCollapsed"
          ></span>
        </tri-header>
        <tri-content>
          <div>Bill is a cat.</div>
        </tri-content>
        <tri-footer>Ant Design ©2019 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
    <ng-template #trigger>
      <tri-icon type="up" />
    </ng-template>
  `
})
export class TriLayoutCustomTriggerComponent {
  isCollapsed = false;
  triggerTemplate: TemplateRef<void> | null = null;
  @ViewChild('trigger', { static: true }) customTrigger!: TemplateRef<void>;

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }
}

@Component({
  imports: [TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider
        collapsible
        [(collapsedChange)]="isCollapsed"
        [width]="width"
        [reverseArrow]="isReverseArrow"
      ></tri-sider>
      <tri-layout>
        <tri-header></tri-header>
        <tri-content>
          <div>Bill is a cat.</div>
        </tri-content>
        <tri-footer>Ant Design ©2019 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `
})
export class TriLayoutSideComponent {
  isCollapsed = false;
  isReverseArrow = false;
  width: string | number = '200px';
}

@Component({
  imports: [TriIconModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider
        collapsible
        [(collapsedChange)]="isCollapsed"
        [breakpoint]="'lg'"
        [collapsedWidth]="0"
        [zeroTrigger]="zeroTrigger"
      ></tri-sider>
      <tri-layout>
        <tri-header></tri-header>
        <tri-content>
          <div>Content</div>
        </tri-content>
        <tri-footer>Ant Design ©2019 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
    <ng-template #zeroTrigger>
      <tri-icon type="menu-fold" theme="outline" />
    </ng-template>
  `
})
export class TriLayoutResponsiveComponent {
  isCollapsed = false;
}

@Component({
  imports: [TriLayoutModule],
  selector: 'tri-test-layout-basic',
  template: `
    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-content>Content</tri-content>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-sider>Sider</tri-sider>
        <tri-content>Content</tri-content>
      </tri-layout>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-content>Content</tri-content>
        <tri-sider>Sider</tri-sider>
      </tri-layout>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-sider>Sider</tri-sider>
      <tri-layout>
        <tri-header>Header</tri-header>
        <tri-content>Content</tri-content>
        <tri-footer>Footer</tri-footer>
      </tri-layout>
    </tri-layout>
  `
})
export class TriLayoutBasicComponent {}

@Component({
  imports: [BidiModule, TriLayoutBasicComponent],
  template: `
    <div [dir]="direction">
      <tri-test-layout-basic></tri-test-layout-basic>
    </div>
  `
})
export class TriTestLayoutRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}
