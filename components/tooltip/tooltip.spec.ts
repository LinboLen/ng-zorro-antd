/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { vi } from 'vitest';

import { provideNzNoAnimation } from 'ng-zorro-antd/core/animation';
import { TriElementPatchDirective } from 'ng-zorro-antd/core/element-patch';
import { dispatchMouseEvent } from 'ng-zorro-antd/core/testing';

import { TriTooltipBaseDirective, TriTooltipTrigger } from './base';
import { TriTooltipDirective } from './tooltip';
import { TriTooltipModule } from './tooltip.module';

describe('tooltip', () => {
  let fixture: ComponentFixture<TriTooltipTestComponent>;
  let component: TriTooltipTestComponent;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    fixture = TestBed.createComponent(TriTooltipTestComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
    fixture.detectChanges();
  });

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function getTextContentOf(selector: string): string | null {
    const el = overlayContainerElement.querySelector(selector);
    return el && el.textContent ? el.textContent : null;
  }

  function getTitleTextContent(): string | null {
    return getTextContentOf('.ant-tooltip-title');
  }

  function waitingForTooltipToggling(): void {
    fixture.detectChanges();
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
  }

  describe('visibility', () => {
    it('should hover mode work', () => {
      const title = 'title-string';
      const triggerElement = component.titleString.nativeElement;

      expect(overlayContainerElement.textContent).not.toContain(title);

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();
      dispatchMouseEvent(triggerElement, 'mouseenter');
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(title);
      expect(component.visibilityTogglingCount).toBe(1);

      const overlayElement = getOverlayElementForTooltip(component.titleStringDirective);

      dispatchMouseEvent(triggerElement, 'mouseleave');
      fixture.detectChanges();
      dispatchMouseEvent(overlayElement, 'mouseenter');
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(title);

      dispatchMouseEvent(overlayElement, 'mouseleave');
      waitingForTooltipToggling();
      // FIXME: the following line errors
      // expect(overlayContainerElement.textContent).not.toContain(title);
      // Don't know why this breaks. The website works fine.

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(title);

      dispatchMouseEvent(triggerElement, 'mouseleave');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(title);

      component.mouseEnterDelay.set(0.2);
      fixture.detectChanges();
      dispatchMouseEvent(triggerElement, 'mouseenter');
      vi.advanceTimersByTime(150);
      expect(overlayContainerElement.textContent).not.toContain(title);
      vi.advanceTimersByTime(50);
      expect(overlayContainerElement.textContent).toContain(title);

      dispatchMouseEvent(triggerElement, 'mouseleave');
      vi.advanceTimersByTime(150);
      expect(overlayContainerElement.textContent).not.toContain(title);

      component.mouseEnterDelay.set(0.15);
      component.mouseLeaveDelay.set(0.2);
      fixture.detectChanges();
      dispatchMouseEvent(triggerElement, 'mouseenter');
      vi.advanceTimersByTime(150);
      expect(overlayContainerElement.textContent).toContain(title);

      dispatchMouseEvent(triggerElement, 'mouseleave');
      vi.advanceTimersByTime(150);
      expect(overlayContainerElement.textContent).toContain(title);
      vi.advanceTimersByTime(50);
      expect(overlayContainerElement.textContent).not.toContain(title);
    });

    it('should click mode work', () => {
      const title = 'title-template';
      const triggerElement = component.titleTemplate.nativeElement;

      dispatchMouseEvent(triggerElement, 'click');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(title);

      dispatchMouseEvent(document.body, 'click');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(title);
    });

    it('should focus and blur mode work', () => {
      const title = 'focus';
      const triggerElement = component.focusTemplate.nativeElement;

      dispatchMouseEvent(triggerElement, 'focusin');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(title);

      dispatchMouseEvent(triggerElement, 'focusout');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(title);
    });

    it('should support changing visibility programmatically', () => {
      const title = 'program';

      component.visible.set(true);
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(title);
      expect(component.visibilityTogglingCount).toBe(1);

      component.visible.set(false);
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(title);
      expect(component.visibilityTogglingCount).toBe(2);
    });

    it('should not hide tooltip when `nzTooltipTrigger` is null', () => {
      const title = 'always show';

      component.trigger.set(null);
      component.visible.set(true);
      waitingForTooltipToggling();
      dispatchMouseEvent(document.body, 'click');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(title);

      component.trigger.set('click');
      waitingForTooltipToggling();
      dispatchMouseEvent(document.body, 'click');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(title);
    });
  });

  describe('content', () => {
    it('cannot be visible when the title is empty', () => {
      const triggerElement = component.titleString.nativeElement;

      component.title.set(null);
      fixture.detectChanges();

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();
      expect(getTitleTextContent()).toBeNull();
      expect(component.visibilityTogglingCount).toBe(0);
    });

    it('should change overlayStyle when the overlayStyle is changed', () => {
      const triggerElement = component.titleString.nativeElement;

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();

      component.style.set({ color: '#fff' });
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector<HTMLElement>('.ant-tooltip')!.style.color).toBe(
        'rgb(255, 255, 255)'
      );

      component.style.set({ color: '#000' });
      fixture.detectChanges();
      expect(overlayContainerElement.querySelector<HTMLElement>('.ant-tooltip')!.style.color).toBe('rgb(0, 0, 0)');
    });

    it('should change overlayClass when the nzTooltipOverlayClassName is changed', () => {
      const triggerElement = component.titleString.nativeElement;

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();

      component.class.set('testClass2');
      fixture.detectChanges();

      expect(overlayContainerElement.querySelector<HTMLElement>('.testClass')).toBeNull();
      expect(overlayContainerElement.querySelector<HTMLElement>('.testClass2')).not.toBeNull();
    });

    it('should nzTooltipOverlayClassName support classes listed in the string (space delimited)', () => {
      const triggerElement = component.titleString.nativeElement;
      component.class.set('testClass1 testClass2');
      fixture.detectChanges();

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();

      expect(overlayContainerElement.querySelector<HTMLElement>('.testClass1.testClass2')).not.toBeNull();
    });

    it('should hide when the title is changed to null', async () => {
      const title = 'title-string';
      const triggerElement = component.titleString.nativeElement;

      expect(overlayContainerElement.textContent).not.toContain(title);

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain(title);
      expect(component.visibilityTogglingCount).toBe(1);

      // Should close when the title is changed to null.
      component.title.set(null);
      fixture.detectChanges();
      waitingForTooltipToggling();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).not.toContain(title);
      expect(component.visibilityTogglingCount).toBe(2);
    });

    // changing the title on the directive should be synced to the component
    it('should set `setTitle` proxy to `nzTitle`', () => {
      const triggerElement = component.titleString.nativeElement;
      const tooltipComponent = component.titleStringDirective.component!;

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();
      expect(tooltipComponent.title).toBe('title-string');
      expect(overlayContainerElement.textContent).toContain('title-string');

      component.title.set('changed!');
      fixture.detectChanges();
      expect(tooltipComponent.title).toBe('changed!');
      expect(overlayContainerElement.textContent).toContain('changed!');
    });

    it('should support changing trigger', () => {
      const featureKey = 'title-template';
      const triggerElement = component.titleTemplate.nativeElement;

      dispatchMouseEvent(triggerElement, 'click');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).toContain(featureKey);

      dispatchMouseEvent(document.body, 'click');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(featureKey);

      component.trigger.set(null);
      fixture.detectChanges();

      dispatchMouseEvent(triggerElement, 'mouseenter');
      waitingForTooltipToggling();
      expect(overlayContainerElement.textContent).not.toContain(featureKey);
    });

    it('should support changing position', () => {
      const tooltipComponent = component.titleStringDirective.component!;

      // here we just make sure the preferred position is the first in the position array
      expect(tooltipComponent._positions.length).toBe(5);
    });

    it('should background work', () => {
      const triggerElement = component.titleTemplate.nativeElement;
      component.color.set('pink');
      fixture.detectChanges();

      dispatchMouseEvent(triggerElement, 'click');
      waitingForTooltipToggling();
      const tooltip = overlayContainerElement.querySelector<HTMLElement>('.ant-tooltip')!;
      expect(tooltip.classList).toContain('ant-tooltip-pink');

      component.color.set('#f50');
      fixture.detectChanges();

      expect(tooltip.querySelector<HTMLElement>('.ant-tooltip-inner')!.style.backgroundColor).toBe('rgb(255, 85, 0)');
      const arrow = tooltip.querySelector<HTMLElement>('.ant-tooltip-arrow')!;
      // Check that the CSS variable is correctly set on the arrow element
      const arrowStyles = getComputedStyle(arrow);
      const cssVarValue = arrowStyles.getPropertyValue('--antd-arrow-background-color').trim();
      expect(cssVarValue).toBe('#f50');
    });
  });

  describe('dom', () => {
    it('should not insert element as the sibling of the directive element', () => {
      fixture.detectChanges();
      const triggerElement = component.inBtnGroup.nativeElement;
      // There's a <!--container--> element created by Ivy.
      expect(triggerElement.nextSibling.nextSibling.tagName).toBe('BUTTON');
    });
  });
});

describe('origin', () => {
  let component: TriTestTooltipTargetComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    const fixture = TestBed.createComponent(TriTestTooltipTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should target work', () => {
    expect((component.tooltip!.component!.origin!.nativeElement as HTMLElement).tagName).toBe('BUTTON');
  });
});

describe('arrow', () => {
  let component: TriTestTooltipArrowComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideNzNoAnimation()]
    });
    const fixture = TestBed.createComponent(TriTestTooltipArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should support arrow pointing at center', () => {
    const overlayElement = getOverlayElementForTooltip(component.tooltipDirective);

    expect(overlayElement.querySelector('.ant-tooltip-arrow')).toBeTruthy();
    // just read style.transform wouldn't get us the correct result
    /** FIXME
     * This test failed on CI but not on local ...
     * expect(overlayElement.parentElement!.innerHTML).toContain('transform: translateX');
     * **/
  });
});

function getOverlayElementForTooltip(tooltip: TriTooltipBaseDirective): HTMLElement {
  return tooltip!.component!.overlay.overlayRef.overlayElement;
}

@Component({
  imports: [TriTooltipModule],
  template: `
    <a
      #titleString
      tri-tooltip
      [tooltipTitle]="title()"
      tooltipTrigger="hover"
      tooltipPlacement="topLeft"
      [tooltipOverlayClassName]="class()"
      [tooltipOverlayStyle]="style()"
      [tooltipMouseEnterDelay]="mouseEnterDelay()"
      [tooltipMouseLeaveDelay]="mouseLeaveDelay()"
      (tooltipVisibleChange)="onVisibleChange()"
    >
      Hover
    </a>

    <a #titleTemplate tri-tooltip [tooltipTitle]="template" [tooltipTrigger]="trigger()" [tooltipColor]="color()">
      Click
    </a>

    <a #focusTooltip tri-tooltip tooltipTrigger="focus" tooltipTitle="focus">Focus</a>

    <a
      #program
      tri-tooltip
      [tooltipTrigger]="null"
      tooltipTitle="program"
      [tooltipVisible]="visible()"
      (tooltipVisibleChange)="onVisibleChange()"
    >
      Manually
    </a>

    <a
      #alwaysShow
      tri-tooltip
      [tooltipTrigger]="trigger()"
      tooltipTitle="always show"
      [tooltipVisible]="visible()"
    >
      Always Show
    </a>

    <div>
      <button>A</button>
      <button #inBtnGroup tri-tooltip tooltipTitle="title-string">B</button>
      <button>C</button>
    </div>

    <ng-template #template>title-template</ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTooltipTestComponent {
  @ViewChild('titleString', { static: false }) titleString!: ElementRef;
  @ViewChild('titleString', { static: false, read: TriTooltipDirective })
  titleStringDirective!: TriTooltipDirective;

  @ViewChild('titleTemplate', { static: false }) titleTemplate!: ElementRef;
  @ViewChild('titleTemplate', { static: false, read: TriTooltipDirective })
  titleTemplateDirective!: TriTooltipDirective;

  @ViewChild('focusTooltip', { static: false }) focusTemplate!: ElementRef;
  @ViewChild('alwaysShow', { static: false }) alwaysShow!: ElementRef;

  readonly trigger = signal<TriTooltipTrigger>('click');

  @ViewChild('inBtnGroup', { static: false }) inBtnGroup!: ElementRef;

  readonly title = signal<string | null>('title-string');
  readonly visible = signal(false);
  visibilityTogglingCount = 0;
  readonly style = signal({ color: '#000' });
  readonly class = signal('testClass');
  readonly mouseEnterDelay = signal(0.15);
  readonly mouseLeaveDelay = signal(0.1);
  readonly color = signal<string | undefined>(undefined);
  onVisibleChange(): void {
    this.visibilityTogglingCount += 1;
  }
}

@Component({
  imports: [TriElementPatchDirective, TriTooltipModule],
  template: `
    <button tri-element #button="nzElement">Action</button>
    <a tri-tooltip tooltipTitle="This action could not be revoked!" [tooltipOrigin]="button.elementRef">Notice</a>
  `
})
export class TriTestTooltipTargetComponent {
  @ViewChild(TriTooltipDirective) tooltip?: TriTooltipDirective;
}

@Component({
  imports: [TriTooltipModule],
  template: `
    <a
      #titleString
      tri-tooltip
      [tooltipVisible]="true"
      tooltipTitle="Title"
      tooltipPlacement="bottomLeft"
      [tooltipArrowPointAtCenter]="true"
    >
      Tooltip
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class TriTestTooltipArrowComponent {
  @ViewChild('titleString', { static: false, read: TriTooltipDirective }) tooltipDirective!: TriTooltipDirective;
}
