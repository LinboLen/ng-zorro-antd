/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import { Component, DebugElement, DOCUMENT, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { TriScrollService } from 'ng-zorro-antd/core/services';
import { sleep, updateNonSignalsInput } from 'ng-zorro-antd/core/testing';
import { TriDirectionVHType, TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriAnchorComponent } from './anchor.component';
import { TriAnchorModule } from './anchor.module';

const throttleTime = 51;

describe('anchor', () => {
  let fixture: ComponentFixture<TestComponent>;
  let dl: DebugElement;
  let context: TestComponent;
  let page: PageObject;
  let srv: TriScrollService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()]
    });
    fixture = TestBed.createComponent(TestComponent);
    dl = fixture.debugElement;
    context = fixture.componentInstance;
    fixture.autoDetectChanges();
    page = new PageObject();
    srv = TestBed.inject(TriScrollService);
    await fixture.whenStable();
    await sleep(100);
    spyOn(context, '_scroll');
    spyOn(context, '_change');
  });

  afterEach(() => fixture.destroy());

  describe('[default]', () => {
    it(`should scrolling to target via click a link`, () => {
      spyOn(srv, 'scrollTo').and.callFake((_containerEl, _targetTopValue = 0, options = {}) => {
        if (options.callback) {
          options.callback();
        }
      });
      expect(context._scroll).not.toHaveBeenCalled();
      page.to('#何时使用');
      expect(context._scroll).toHaveBeenCalled();
    });

    it('should be activated when scrolling to the anchor', async () => {
      expect(context._scroll).not.toHaveBeenCalled();
      page.scrollTo();
      await sleep(throttleTime);
      const inkNode = page.getEl('.ant-anchor-ink-ball');
      expect(+inkNode.style.top!.replace('px', '')).toBeGreaterThan(0);
      expect(context._scroll).toHaveBeenCalled();
    });

    it('should be activated when scrolling to the anchor - horizontal', async () => {
      context.direction = 'horizontal';
      await updateNonSignalsInput(fixture);
      expect(context._scroll).not.toHaveBeenCalled();
      page.scrollTo();
      await sleep(throttleTime);
      const inkNode = page.getEl('.ant-anchor-ink-ball');
      expect(+inkNode.style.left!.replace('px', '')).not.toBeNull();
      expect(context._scroll).toHaveBeenCalled();
    });

    it('should clean activated when leaving all anchor', async () => {
      spyOn(context.comp, 'clearActive' as TriSafeAny);
      page.scrollTo();
      await sleep(throttleTime);
      fixture.detectChanges();
      expect(context.comp['clearActive']).not.toHaveBeenCalled();
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
      await sleep(throttleTime);
      fixture.detectChanges();
      expect(context.comp['clearActive']!).toHaveBeenCalled();
    });

    it(`won't scrolling when is not exists link`, () => {
      spyOn(srv, 'getScroll');
      expect(context._scroll).not.toHaveBeenCalled();
      expect(srv.getScroll).not.toHaveBeenCalled();
      page!.to('#invalid');
      expect(srv.getScroll).not.toHaveBeenCalled();
    });

    it(`won't scrolling when is invalid link`, () => {
      spyOn(srv, 'getScroll');
      expect(context._scroll).not.toHaveBeenCalled();
      expect(srv.getScroll).not.toHaveBeenCalled();
      page.to('invalidLink');
      expect(srv.getScroll).not.toHaveBeenCalled();
    });

    it(`supports complete href link (e.g. http://www.example.com/#id)`, () => {
      spyOn(srv, 'getScroll');
      expect(context._scroll).not.toHaveBeenCalled();
      expect(srv.getScroll).not.toHaveBeenCalled();
      page.getEl('.mock-complete').click();
      fixture.detectChanges();
      expect(srv.getScroll).not.toHaveBeenCalled();
    });

    it(`should priorities most recently`, async () => {
      expect(context._scroll).not.toHaveBeenCalled();
      page.scrollTo('#parallel1');
      await sleep(throttleTime);
      expect(context._scroll).toHaveBeenCalled();
    });
  });

  describe('property', () => {
    describe('[nzAffix]', () => {
      it(`is [true]`, () => {
        const linkList = dl.queryAll(By.css('nz-affix'));
        expect(linkList.length).toBe(1);
      });
      it(`is [false]`, async () => {
        let linkList = dl.queryAll(By.css('nz-affix'));
        expect(linkList.length).toBe(1);
        context.affix = false;
        await updateNonSignalsInput(fixture);
        linkList = dl.queryAll(By.css('nz-affix'));
        expect(linkList.length).toBe(0);
      });
    });

    describe('[nzOffsetTop]', () => {
      it('should be using "calc" method calculate max-height', () => {
        const wrapperEl = dl.query(By.css('.ant-anchor-wrapper'));
        expect(wrapperEl.styles['max-height']).toContain('calc(');
      });
    });

    describe('[nzCurrentAnchor]', () => {
      it('customize the anchor highlight', async () => {
        context.currentAnchor = '#basic';
        await updateNonSignalsInput(fixture);
        const linkList = dl.queryAll(By.css('.ant-anchor-link'));
        expect(linkList.length).toBeGreaterThan(0);
        const activeLink = linkList.find(n => (n.nativeElement as HTMLDivElement).getAttribute('nzhref') === '#basic')!;
        expect(activeLink).toBeTruthy();
        expect((activeLink.nativeElement as HTMLDivElement).classList).toContain('ant-anchor-link-active');
      });
    });

    describe('[nzShowInkInFixed]', () => {
      beforeEach(async () => {
        context.affix = false;
        await updateNonSignalsInput(fixture);
      });
      it('should be show ink when [false]', async () => {
        context.showInkInFixed = false;
        await updateNonSignalsInput(fixture);
        page.scrollTo();
        expect(dl.query(By.css('.ant-anchor-fixed')) == null).toBe(false);
      });
      it('should be hide ink when [true]', async () => {
        context.showInkInFixed = true;
        await updateNonSignalsInput(fixture);
        page.scrollTo();
        expect(dl.query(By.css('.ant-anchor-fixed')) == null).toBe(true);
      });
    });

    describe('[nzContainer]', () => {
      it('with window', async () => {
        spyOn(window, 'addEventListener');
        context.container = window;
        await updateNonSignalsInput(fixture);
        expect(window.addEventListener).toHaveBeenCalled();
      });
      it('with string', async () => {
        spyOn(context, '_click');
        const el = document.querySelector('#target')!;
        spyOn(el, 'addEventListener');
        context.container = '#target';
        await updateNonSignalsInput(fixture);
        expect(el.addEventListener).toHaveBeenCalled();
        page.to('#basic-target');
        expect(context._click).toHaveBeenCalled();
      });
    });

    describe('(nzChange)', () => {
      it('should emit nzChange when click a link', async () => {
        spyOn(srv, 'scrollTo').and.callFake((_containerEl, _targetTopValue = 0, options = {}) => {
          if (options.callback) {
            options.callback();
          }
        });
        expect(context._change).not.toHaveBeenCalled();
        page.to('#basic-target');
        expect(context._change).toHaveBeenCalled();
      });
      it('should emit nzChange when scrolling to the anchor', async () => {
        spyOn(context, '_change');
        expect(context._change).not.toHaveBeenCalled();
        page.scrollTo();
        await sleep(throttleTime);
        const inkNode = page.getEl('.ant-anchor-ink-ball');
        expect(+inkNode.style.top!.replace('px', '')).toBeGreaterThan(0);
        expect(context._change).toHaveBeenCalled();
      });
    });

    it('(nzClick)', () => {
      spyOn(context, '_click');
      expect(context._click).not.toHaveBeenCalled();
      const linkList = dl.queryAll(By.css('.ant-anchor-link-title'));
      expect(linkList.length).toBeGreaterThan(0);
      (linkList[0].nativeElement as HTMLLinkElement).click();
      fixture.detectChanges();
      expect(context._click).toHaveBeenCalled();
    });
  });

  describe('link', () => {
    it(`should show custom template of [nzTemplate]`, () => {
      expect(dl.query(By.css('.nzTemplate-title')) != null).toBe(true);
    });
    it(`should show custom template of [nzTitle]`, () => {
      expect(dl.query(By.css('.nzTitle-title')) != null).toBe(true);
    });
  });

  describe('direction', () => {
    it(`should have vertical direction by default`, () => {
      const wrapperEl = dl.query(By.css('.ant-anchor-wrapper'));
      expect(wrapperEl.nativeElement.classList).not.toContain('ant-anchor-wrapper-horizontal');
    });

    it(`should have correct class name in horizontal mode`, async () => {
      context.direction = 'horizontal';
      await updateNonSignalsInput(fixture);
      const wrapperEl = dl.query(By.css('.ant-anchor-wrapper'));
      expect(wrapperEl.nativeElement.classList).toContain('ant-anchor-wrapper-horizontal');
    });
  });

  describe('**boundary**', () => {
    it('#getOffsetTop', async () => {
      const el1 = document.getElementById('何时使用')!;
      spyOn(el1, 'getClientRects').and.returnValue([] as TriSafeAny);
      const el2 = document.getElementById('parallel1')!;
      spyOn(el2, 'getBoundingClientRect').and.returnValue({
        top: 0
      } as TriSafeAny);
      expect(context._scroll).not.toHaveBeenCalled();
      page.scrollTo();
      await sleep(throttleTime);
      expect(context._scroll).toHaveBeenCalled();
    });
  });

  class PageObject {
    getEl(cls: string): HTMLElement {
      const el = dl.query(By.css(cls));
      expect(el).not.toBeNull();
      return el.nativeElement as HTMLElement;
    }
    to(href: string = '#basic'): this {
      this.getEl(`nz-affix [href="${href}"]`).click();
      fixture.detectChanges();
      return this;
    }
    scrollTo(href: string = '#basic'): this {
      const toNode = dl.query(By.css(href));
      (toNode.nativeElement as HTMLElement).scrollIntoView();
      fixture.detectChanges();
      return this;
    }
  }
});

@Component({
  imports: [TriAnchorModule],
  template: `
    <tri-anchor
      [affix]="affix"
      [bounds]="bounds"
      [showInkInFixed]="showInkInFixed"
      [offsetTop]="offsetTop"
      [targetOffset]="targetOffset"
      [container]="container"
      [currentAnchor]="currentAnchor"
      [direction]="direction"
      (click)="_click()"
      (scroll)="_scroll()"
      (change)="_change()"
    >
      <tri-link href="#何时使用" title="何时使用" />
      <tri-link href="#basic" title="Basic demo" />
      <tri-link href="#API-AnchorLink">
        <ng-template #nzTemplate>
          <span class="nzTemplate-title">tpl</span>
        </ng-template>
      </tri-link>
      <tri-link href="#API" title="API">
        <tri-link href="#API-Anchor" title="nz-anchor" />
        <tri-link href="#API-AnchorLink" [title]="title">
          <ng-template #title>
            <span class="nzTitle-title">tpl-title</span>
          </ng-template>
        </tri-link>
      </tri-link>
      <tri-link href="#invalid" title="invalid" />
      <tri-link href="invalidLink" title="invalidLink" />
      <tri-link href="http://www.example.com/#id" title="complete" class="mock-complete" />
      <tri-link href="#parallel1" title="parallel1" />
      <tri-link href="#parallel2" title="parallel2" />
      <tri-link href="#basic-target" title="basic-target" />
    </tri-anchor>
    <h2 id="何时使用"></h2>
    <div style="height: 1000px"></div>
    <h2 id="basic"></h2>
    <div style="height: 100px"></div>
    <h2 id="API"></h2>
    <div style="height: 100px"></div>
    <h2 id="API-Anchor"></h2>
    <div style="height: 100px"></div>
    <h2 id="API-AnchorLink"></h2>
    <table>
      <tr>
        <td><h2 id="parallel1">parallel1</h2></td>
        <td><h2 id="parallel2">parallel2</h2></td>
      </tr>
    </table>

    <div style="height: 1000px"></div>
    <div id="target">
      <div style="height: 1000px"></div>
      <h2 id="basic-target"></h2>
    </div>
  `,
  styles: `
    @import '../style/testing.less';
    @import './style/patch.less';
  `
})
export class TestComponent {
  @ViewChild(TriAnchorComponent, { static: false }) comp!: TriAnchorComponent;
  affix = true;
  bounds = 5;
  offsetTop = 0;
  targetOffset?: number;
  showInkInFixed = false;
  container: TriSafeAny = null;
  currentAnchor?: string;
  direction: TriDirectionVHType = 'vertical';
  _click(): void {}
  _change(): void {}
  _scroll(): void {}
}

describe('NzAnchor', () => {
  let component: TriAnchorComponent;
  let fixture: ComponentFixture<TriAnchorComponent>;
  let mockPlatform: Platform;
  let scrollService: TriScrollService;
  let mockDocument: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TriAnchorComponent,
        { provide: DOCUMENT, useValue: document },
        TriScrollService,
        { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) }
      ]
    });

    fixture = TestBed.createComponent(TriAnchorComponent);
    component = fixture.componentInstance;
    mockPlatform = TestBed.inject(Platform);
    scrollService = TestBed.inject(TriScrollService);
    mockDocument = TestBed.inject(DOCUMENT);
  });

  it('should not register listeners if platform is not browser', () => {
    mockPlatform.isBrowser = false;

    component.ngAfterViewInit();
    expect(component['handleScrollTimeoutID']).toBeFalsy();
  });

  it('should calculate the correct offsetTop in handleScroll method', () => {
    component.targetOffset = 50;
    component.offsetTop = 20;
    component.bounds = 5;

    component.handleScroll();

    expect(component.targetOffset).toBe(50);
    expect(component.offsetTop).toBe(20);
  });

  it('should calculate target scroll top correctly and call scrollTo', () => {
    const mockElement = document.createElement('div');
    spyOn(mockDocument, 'getElementById').and.returnValue(mockElement);
    spyOn(mockDocument, 'querySelector').and.returnValue(mockElement);
    spyOn(scrollService, 'getScroll').and.returnValue(100);
    spyOn<TriSafeAny>(component, 'getContainer').and.returnValue(window);

    component.targetOffset = undefined;
    component.offsetTop = undefined;

    const mockLinkComponent = {
      nzHref: '#test',
      setActive: jasmine.createSpy('setActive'),
      getLinkTitleElement: () => document.createElement('a')
    } as TriSafeAny;

    const scrollToSpy = spyOn(scrollService, 'scrollTo').and.callThrough();

    component.handleScrollTo(mockLinkComponent);

    expect(scrollToSpy).toHaveBeenCalledWith(component['getContainer'](), 100, jasmine.any(Object));
  });
});
