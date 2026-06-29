/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Component, DebugElement, signal, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { provideMockDirectionality } from 'ng-zorro-antd/core/testing';
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
      fixture = TestBed.createComponent(TriLayoutSideComponent);
      testComponent = fixture.componentInstance;
      sider = fixture.debugElement.query(By.directive(TriSiderComponent));
    });

    it('should nzCollapsed work', () => {
      testComponent.isCollapsed.set(false);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(sider.nativeElement.style.cssText).toBe(
        'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
      );
      expect(trigger.nativeElement.style.cssText).toBe('width: 200px;');
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed()).toBe(true);
      expect(sider.nativeElement.style.cssText).toBe('flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;');
      expect(trigger.nativeElement.style.cssText).toBe('width: 80px;');
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed()).toBe(false);
      expect(sider.nativeElement.style.cssText).toBe(
        'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
      );
      expect(trigger.nativeElement.style.cssText).toBe('width: 200px;');
      testComponent.isCollapsed.set(true);
      fixture.detectChanges();
      expect(sider.nativeElement.style.cssText).toBe('flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;');
      expect(trigger.nativeElement.style.cssText).toBe('width: 80px;');
      testComponent.isCollapsed.set(false);
      fixture.detectChanges();
      expect(sider.nativeElement.style.cssText).toBe(
        'flex: 0 0 200px; max-width: 200px; min-width: 200px; width: 200px;'
      );
      expect(trigger.nativeElement.style.cssText).toBe('width: 200px;');
    });

    it('should nzWidth work', () => {
      testComponent.isCollapsed.set(false);
      testComponent.width.set(300);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(sider.nativeElement.style.cssText).toBe(
        'flex: 0 0 300px; max-width: 300px; min-width: 300px; width: 300px;'
      );
      expect(trigger.nativeElement.style.cssText).toBe('width: 300px;');
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed()).toBe(true);
      expect(sider.nativeElement.style.cssText).toBe('flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;');
      expect(trigger.nativeElement.style.cssText).toBe('width: 80px;');
      trigger.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.isCollapsed()).toBe(false);
      expect(sider.nativeElement.style.cssText).toBe(
        'flex: 0 0 300px; max-width: 300px; min-width: 300px; width: 300px;'
      );
      expect(trigger.nativeElement.style.cssText).toBe('width: 300px;');
      testComponent.isCollapsed.set(true);
      fixture.detectChanges();
      expect(sider.nativeElement.style.cssText).toBe('flex: 0 0 80px; max-width: 80px; min-width: 80px; width: 80px;');
      expect(trigger.nativeElement.style.cssText).toBe('width: 80px;');
      testComponent.isCollapsed.set(false);
      fixture.detectChanges();
      expect(sider.nativeElement.style.cssText).toBe(
        'flex: 0 0 300px; max-width: 300px; min-width: 300px; width: 300px;'
      );
      expect(trigger.nativeElement.style.cssText).toBe('width: 300px;');
    });

    it('should nzReverseArrow work', () => {
      testComponent.isCollapsed.set(false);
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.ant-layout-sider-trigger'));
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-left')).toBe(true);
      testComponent.isCollapsed.set(true);
      fixture.detectChanges();
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-right')).toBe(true);
      testComponent.isReverseArrow.set(true);
      testComponent.isCollapsed.set(false);
      fixture.detectChanges();
      expect(trigger.nativeElement.firstElementChild!.classList.contains('anticon-right')).toBe(true);
      testComponent.isCollapsed.set(true);
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

    it('should responsive work', async () => {
      viewport.set(500);
      window.dispatchEvent(new Event('resize'));
      await fixture.whenStable();
      expect(sider.nativeElement.style.cssText).toBe('flex: 0 0 0px; max-width: 0px; min-width: 0px; width: 0px;');
      expect(
        sider.nativeElement
          .querySelector('.ant-layout-sider-zero-width-trigger')
          .firstElementChild.getAttribute('nzType')
      ).toBe('menu-fold');
      viewport.reset();
    });
  });

  describe('RTL', () => {
    let fixture: ComponentFixture<TriLayoutBasicComponent>;
    let layouts: DebugElement[];
    let dir: Directionality;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMockDirectionality()]
      });
      fixture = TestBed.createComponent(TriLayoutBasicComponent);
      layouts = fixture.debugElement.queryAll(By.directive(TriLayoutComponent));
      dir = TestBed.inject(Directionality);
    });

    it('should className correct on dir change', () => {
      dir.valueSignal.set('rtl');
      fixture.detectChanges();
      expect(layouts.every(layout => layout.nativeElement.classList.contains('ant-layout-rtl'))).toBe(true);

      dir.valueSignal.set('ltr');
      fixture.detectChanges();
      expect(layouts.every(layout => layout.nativeElement.classList.contains('ant-layout-rtl'))).toBe(false);
    });
  });
});

@Component({
  imports: [TriIconModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider collapsible [(collapsedChange)]="isCollapsed" [trigger]="triggerTemplate" />
      <tri-layout>
        <tri-header>
          <tri-icon
            class="trigger"
            [type]="isCollapsed() ? 'menu-unfold' : 'menu-fold'"
            (click)="isCollapsed.set(!isCollapsed())"
          />
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriLayoutCustomTriggerComponent {
  readonly isCollapsed = signal(false);
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
      <tri-sider collapsible [(collapsedChange)]="isCollapsed" [width]="width()" [reverseArrow]="isReverseArrow()" />
      <tri-layout>
        <tri-header />
        <tri-content>
          <div>Bill is a cat.</div>
        </tri-content>
        <tri-footer>Ant Design ©2019 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `
})
export class TriLayoutSideComponent {
  readonly isCollapsed = signal(false);
  readonly isReverseArrow = signal(false);
  readonly width = signal<string | number>('200px');
}

@Component({
  imports: [TriIconModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider
        collapsible
        [(collapsedChange)]="isCollapsed"
        breakpoint="lg"
        [collapsedWidth]="0"
        [zeroTrigger]="zeroTrigger"
      />
      <tri-layout>
        <tri-header />
        <tri-content>
          <div>Content</div>
        </tri-content>
        <tri-footer>Ant Design ©2019 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
    <ng-template #zeroTrigger>
      <tri-icon type="menu-fold" theme="outline" />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriLayoutResponsiveComponent {
  readonly isCollapsed = signal(false);
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
