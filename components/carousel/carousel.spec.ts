/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ENTER, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { vi } from 'vitest';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import {
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  testDirectionality,
  updateNonSignalsInput
} from 'ng-zorro-antd/core/testing';

import { TriCarouselContentDirective } from './carousel-content.directive';
import { TriCarouselComponent } from './carousel.component';
import { TriCarouselModule } from './carousel.module';
import { TriCarouselFlipStrategy } from './strategies/experimental/flip-strategy';
import { TriCarouselTransformNoLoopStrategy } from './strategies/experimental/transform-no-loop-strategy';
import { TRI_CAROUSEL_CUSTOM_STRATEGIES } from './typings';

describe('carousel', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<TriTestCarouselBasicComponent>;
    let testComponent: TriTestCarouselBasicComponent;
    let carouselWrapper: DebugElement;
    let carouselContents: DebugElement[];

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCarouselBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      carouselWrapper = fixture.debugElement.query(By.directive(TriCarouselComponent));
      carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(carouselWrapper.nativeElement.classList).toContain('ant-carousel');
      expect(carouselContents.every(content => content.nativeElement.classList.contains('slick-slide'))).toBe(true);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    });

    it('should dynamic change content work', async () => {
      await stabilize(fixture, 20);
      expect(carouselContents.length).toBe(4);
      testComponent.array.set([]);
      await stabilize(fixture, 20);
      carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));
      expect(carouselContents.length).toBe(0);
    });

    it('should nzDots work', () => {
      fixture.detectChanges();
      expect(testComponent.dots()).toBe(true);
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').children.length).toBe(4);
      testComponent.dots.set(false);
      fixture.detectChanges();
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots')).toBeNull();
    });

    it('should nzDotRender work', () => {
      fixture.detectChanges();
      expect(testComponent.dots()).toBe(true);
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').children.length).toBe(4);
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').firstElementChild.innerText).toBe('1');
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.innerText).toBe('4');
      expect(
        carouselWrapper.nativeElement.querySelector('.slick-dots').firstElementChild.firstElementChild.tagName
      ).toBe('A');
    });

    it('should call layout on component resize', async () => {
      testComponent.carouselComponent.ngOnInit();
      const spy = vi.spyOn(testComponent.carouselComponent, 'layout');
      window.dispatchEvent(new Event('resize'));
      await stabilize(fixture, 500);

      (testComponent.carouselComponent['nzResizeObserver'] as TriResizeObserver)
        .observe(testComponent.carouselComponent.el)
        .subscribe(() => {
          expect(spy).toHaveBeenCalled();
        });
    });

    it('should call layout on component resize', async () => {
      const spyOnResize = vi.spyOn(testComponent.carouselComponent, 'layout');
      window.dispatchEvent(new Event('resize'));
      await stabilize(fixture, 500);

      expect(spyOnResize).toHaveBeenCalled();
    });

    it('should click content change', () => {
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      fixture.detectChanges();
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    });

    it('should keydown change content work', async () => {
      fixture.detectChanges();
      const list = carouselWrapper.nativeElement.querySelector('.slick-list');

      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

      dispatchKeyboardEvent(list, 'keydown', LEFT_ARROW);
      await stabilize(fixture, 20);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      dispatchKeyboardEvent(list, 'keydown', LEFT_ARROW);
      await stabilize(fixture, 20);
      expect(carouselContents[2].nativeElement.classList).toContain('slick-active');
      dispatchKeyboardEvent(list, 'keydown', RIGHT_ARROW);
      await stabilize(fixture, 20);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      dispatchKeyboardEvent(list, 'keydown', RIGHT_ARROW);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    });

    it('should nzDotPosition work', () => {
      testComponent.dotPosition.set('left');
      fixture.detectChanges();
      expect(carouselWrapper.nativeElement.firstElementChild!.classList).toContain('slick-vertical');
    });

    it('should effect change work', async () => {
      await stabilize(fixture, 20);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).toBe(
        'translate3d(0px, 0px, 0px)'
      );
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      await stabilize(fixture, 20);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe('');

      testComponent.effect.set('fade');
      testComponent.dotPosition.set('left');
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      await stabilize(fixture, 20);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).toBe('');

      testComponent.effect.set('scrollx');
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      await stabilize(fixture, 20);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe(
        'translate3d(0px, 0px, 0px)'
      );
    });

    describe('autoplay', () => {
      beforeEach(() => vi.useFakeTimers());
      afterEach(() => vi.useRealTimers());

      beforeEach(() => {
        testComponent.autoPlay.set(true);
        testComponent.autoPlaySpeed.set(20);
        fixture.detectChanges();
      });

      afterEach(() => {
        testComponent.autoPlay.set(false);
        fixture.detectChanges();
      });

      it('should autoplay work', () => {
        testComponent.autoPlay.set(true);
        testComponent.autoPlaySpeed.set(20);
        fixture.detectChanges();
        expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

        vi.advanceTimersByTime(20);
        fixture.detectChanges();
        expect(carouselContents[1].nativeElement.classList).toContain('slick-active');

        vi.advanceTimersByTime(testComponent.carouselComponent.transitionSpeed);
        carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
        fixture.detectChanges();

        vi.advanceTimersByTime(testComponent.carouselComponent.transitionSpeed + testComponent.autoPlaySpeed());
        fixture.detectChanges();
        testComponent.autoPlay.set(false);
        fixture.detectChanges();
        expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      });

      it('should autoplay speed work', () => {
        testComponent.autoPlay.set(true);
        testComponent.autoPlaySpeed.set(20);
        fixture.detectChanges();
        expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

        vi.advanceTimersByTime(20);
        fixture.detectChanges();
        expect(carouselContents[1].nativeElement.classList).toContain('slick-active');

        testComponent.autoPlaySpeed.set(0);
        fixture.detectChanges();
        vi.advanceTimersByTime(60);
        fixture.detectChanges();
        expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
      });
    });

    it('should func work', async () => {
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      testComponent.carouselComponent.next();
      await stabilize(fixture, 20);
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
      testComponent.carouselComponent.pre();
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      testComponent.carouselComponent.goTo(2);
      await stabilize(fixture, 20);
      expect(carouselContents[2].nativeElement.classList).toContain('slick-active');
    });

    it('should resize content after window resized', async () => {
      const resizeSpy = vi.spyOn(testComponent.carouselComponent.strategy!, 'withCarouselContents');
      window.dispatchEvent(new Event('resize'));
      await stabilize(fixture, 16);
      expect(resizeSpy).toHaveBeenCalled();
    });

    // this test may fail on WSL
    it('should support swiping to switch', async () => {
      swipe(testComponent.carouselComponent, 500);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).not.toContain('slick-active');
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');

      swipe(testComponent.carouselComponent, -500);
      await stabilize(fixture, 20);
      swipe(testComponent.carouselComponent, -500);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).not.toContain('slick-active');
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    });

    it('should prevent swipes that are not long enough', async () => {
      swipe(testComponent.carouselComponent, 57);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    });

    it('should disable dragging during transitioning', async () => {
      await stabilize(fixture, 20);
      testComponent.carouselComponent.goTo(1);
      swipe(testComponent.carouselComponent, 500);
      await stabilize(fixture, 20);
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
    });

    it('should disable loop work', async () => {
      testComponent.loop.set(false);
      fixture.detectChanges();
      swipe(testComponent.carouselComponent, -10);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      swipe(testComponent.carouselComponent, -1000);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

      testComponent.loop.set(true);
      fixture.detectChanges();
      swipe(testComponent.carouselComponent, -1000);
      await stabilize(fixture, 20);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      swipe(testComponent.carouselComponent, 1000);
      await stabilize(fixture, 20);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

      testComponent.loop.set(false);
      testComponent.autoPlay.set(true);
      testComponent.autoPlaySpeed.set(20);
      fixture.detectChanges();
      await stabilize(fixture, 140);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      await stabilize(fixture, 40);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    });

    it('should call goTo function on slick dot click', () => {
      vi.spyOn(testComponent.carouselComponent, 'goTo');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      expect(testComponent.carouselComponent.goTo).toHaveBeenCalledWith(3);
    });
  });

  describe('strategies', () => {
    let fixture: ComponentFixture<TriTestCarouselBasicComponent>;
    let testComponent: TriTestCarouselBasicComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCarouselBasicComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
    });

    describe('transform strategy', () => {
      it('horizontal transform', async () => {
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.next();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.pre();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        // From first to last.
        testComponent.carouselComponent.pre();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        // From last to first.
        testComponent.carouselComponent.next();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);
      });

      it('vertical', async () => {
        testComponent.dotPosition.set('left');
        fixture.detectChanges();

        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.next();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.el.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.pre();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        // From first to last.
        testComponent.carouselComponent.pre();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        // From last to first.
        testComponent.carouselComponent.next();
        await stabilize(fixture, 20);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);
      });
    });
  });

  describe('carousel nzAfterChange return value', () => {
    let fixture: ComponentFixture<TriTestCarouselActiveIndexComponent>;
    let testComponent: TriTestCarouselActiveIndexComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(TriTestCarouselActiveIndexComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
    });

    it('carousel activeIndex should be equal to nzAfterChange return value', async () => {
      fixture.detectChanges();
      for (const _ of [0, 1, 2, 3, 4]) {
        testComponent.carouselComponent.next();
        await stabilize(fixture, 20);
        expect(testComponent.index).toBe(testComponent.carouselComponent.activeIndex);
      }
    });
  });
});

describe('carousel custom strategies', () => {
  let fixture: ComponentFixture<TriTestCarouselBasicComponent>;
  let testComponent: TriTestCarouselBasicComponent;
  let carouselWrapper: DebugElement;
  let carouselContents: DebugElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // todo: use zoneless
        provideZoneChangeDetection(),
        {
          provide: TRI_CAROUSEL_CUSTOM_STRATEGIES,
          useValue: [
            {
              name: 'flip',
              strategy: TriCarouselFlipStrategy
            },
            {
              name: 'transform-no-loop',
              strategy: TriCarouselTransformNoLoopStrategy
            }
          ]
        }
      ]
    });
  });

  it('could use custom strategies', async () => {
    fixture = TestBed.createComponent(TriTestCarouselBasicComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    carouselWrapper = fixture.debugElement.query(By.directive(TriCarouselComponent));
    carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));

    testComponent.effect.set('flip');
    fixture.detectChanges();
    expect(carouselContents[0].nativeElement.style.transform).toBe('rotateY(0deg)');
    expect(carouselContents[1].nativeElement.style.transform).toBe('rotateY(180deg)');
    carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
    await stabilize(fixture, 20);
    expect(carouselContents[0].nativeElement.style.transform).toBe('rotateY(180deg)');
    expect(carouselContents[3].nativeElement.style.transform).toBe('rotateY(0deg)');

    testComponent.effect.set('transform-no-loop');
    fixture.detectChanges();
    expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).toBe(
      'translate3d(0px, 0px, 0px)'
    );
    carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
    await stabilize(fixture, 20);
    expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe(
      'translate3d(0px, 0px, 0px)'
    );

    testComponent.dotPosition.set('left');
    fixture.detectChanges();
    carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
    await stabilize(fixture, 20);
    expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe(
      'translate3d(0px, 0px, 0px)'
    );
  });
});

describe('carousel arrows', () => {
  let fixture: ComponentFixture<TriTestCarouselArrowsComponent>;
  let testComponent: TriTestCarouselArrowsComponent;
  let carouselWrapper: DebugElement;
  let carouselContents: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestCarouselArrowsComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    carouselWrapper = fixture.debugElement.query(By.directive(TriCarouselComponent));
    carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));
  });

  it('should render arrows when nzArrows is true', () => {
    const prev = carouselWrapper.nativeElement.querySelector('.slick-prev');
    const next = carouselWrapper.nativeElement.querySelector('.slick-next');
    expect(prev).not.toBeNull();
    expect(next).not.toBeNull();
  });

  it('should navigate via arrows', async () => {
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    carouselWrapper.nativeElement.querySelector('.slick-next').click();
    await stabilize(fixture, 20);
    expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
    carouselWrapper.nativeElement.querySelector('.slick-prev').click();
    await stabilize(fixture, 20);
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
  });

  it('should disable arrows at edges when loop is false', async () => {
    testComponent.loop.set(false);
    fixture.detectChanges();
    const prev = carouselWrapper.nativeElement.querySelector('.slick-prev');
    const next = carouselWrapper.nativeElement.querySelector('.slick-next');
    expect(prev.classList).toContain('slick-disabled');
    expect(next.classList).not.toContain('slick-disabled');

    // Go to last slide
    for (let i = 0; i < 3; i++) {
      next.click();
      await stabilize(fixture, 20);
    }
    expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    expect(next.classList).toContain('slick-disabled');

    // Clicking next should not move beyond last
    next.click();
    await stabilize(fixture, 20);
    expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
  });
});

describe('carousel no swipe', () => {
  let fixture: ComponentFixture<TriTestCarouselNoSwipeComponent>;
  let testComponent: TriTestCarouselNoSwipeComponent;
  let carouselContents: DebugElement[];

  beforeEach(() => {
    fixture = TestBed.createComponent(TriTestCarouselNoSwipeComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));
  });

  it('should not change slide on swipe when nzEnableSwipe is false', async () => {
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    swipe(testComponent.carouselComponent, 500);
    await stabilize(fixture, 20);
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
  });
});

async function stabilize<T>(fixture: ComponentFixture<T>, ms?: number): Promise<void> {
  fixture.detectChanges();
  await updateNonSignalsInput(fixture, ms);
  fixture.detectChanges();
}

/*
 * Swipe a carousel.
 *
 * @param carousel: Carousel component.
 * @param Distance: Positive to right. Negative to left.
 */
function swipe(carousel: TriCarouselComponent, distance: number): void {
  carousel.pointerDown(
    new MouseEvent('mousedown', {
      clientX: 500,
      clientY: 0
    })
  );

  dispatchMouseEvent(document, 'mousemove', 500 - distance, 0);
  dispatchMouseEvent(document, 'mouseup');
}

@Component({
  selector: 'tri-test-carousel',
  imports: [TriCarouselModule],
  template: `
    <tri-carousel
      [effect]="effect()"
      [dots]="dots()"
      [dotPosition]="dotPosition()"
      [dotRender]="dotRender"
      [autoPlay]="autoPlay()"
      [autoPlaySpeed]="autoPlaySpeed()"
      [transitionSpeed]="transitionSpeed()"
      [loop]="loop()"
      (afterChange)="afterChange($event)"
      (beforeChange)="beforeChange($event)"
    >
      @for (index of array(); track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
      <ng-template #dotRender let-index>
        <a>{{ index + 1 }}</a>
      </ng-template>
    </tri-carousel>
  `
})
export class TriTestCarouselBasicComponent {
  @ViewChild(TriCarouselComponent, { static: false }) carouselComponent!: TriCarouselComponent;
  readonly dots = signal(true);
  readonly dotPosition = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
  readonly effect = signal('scrollx');
  readonly array = signal([1, 2, 3, 4]);
  readonly autoPlay = signal(false);
  readonly autoPlaySpeed = signal(3000);
  readonly transitionSpeed = signal(10);
  readonly loop = signal(true);
  afterChange = vi.fn();
  beforeChange = vi.fn();
}

@Component({
  imports: [TriCarouselModule],
  template: `
    <tri-carousel [transitionSpeed]="10" (afterChange)="afterChange($event)">
      @for (index of array; track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
    </tri-carousel>
  `
})
export class TriTestCarouselActiveIndexComponent {
  @ViewChild(TriCarouselComponent, { static: true }) carouselComponent!: TriCarouselComponent;
  array = [0, 1, 2, 3, 4];
  index = 0;

  afterChange(index: number): void {
    this.index = index;
  }
}

@Component({
  selector: 'tri-test-carousel-arrows',
  imports: [TriCarouselModule],
  template: `
    <tri-carousel [arrows]="true" [loop]="loop()" [transitionSpeed]="10">
      @for (index of array; track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
    </tri-carousel>
  `
})
export class TriTestCarouselArrowsComponent {
  @ViewChild(TriCarouselComponent, { static: true }) carouselComponent!: TriCarouselComponent;
  array = [1, 2, 3, 4];
  readonly loop = signal(true);
}

@Component({
  selector: 'tri-test-carousel-no-swipe',
  imports: [TriCarouselModule],
  template: `
    <tri-carousel [enableSwipe]="false" [transitionSpeed]="10">
      @for (index of array; track index) {
        <div tri-carousel-content>
          <h3>{{ index }}</h3>
        </div>
      }
    </tri-carousel>
  `
})
export class TriTestCarouselNoSwipeComponent {
  @ViewChild(TriCarouselComponent, { static: true }) carouselComponent!: TriCarouselComponent;
  array = [1, 2, 3, 4];
}

describe('carousel', () => {
  let fixture: ComponentFixture<TriTestCarouselBasicComponent>;
  let component: TriCarouselComponent;
  let mockObserve$: Subject<void>;

  beforeEach(() => {
    mockObserve$ = new Subject();
    const nzResizeObserverSpy = {
      observe: vi.fn().mockReturnValue(mockObserve$.asObservable())
    };

    TestBed.configureTestingModule({
      providers: [
        // todo: use zoneless
        provideZoneChangeDetection(),
        {
          provide: TriResizeObserver,
          useValue: nzResizeObserverSpy
        }
      ]
    });

    fixture = TestBed.createComponent(TriTestCarouselBasicComponent);
    component = fixture.debugElement.query(By.directive(TriCarouselComponent)).componentInstance;
  });

  it('should not execute if keyCode is not of type LEFT_ARROW  or RIGHT_ARROW', async () => {
    await stabilize(fixture, 20);
    let event: KeyboardEvent;

    event = new KeyboardEvent('keydown', { keyCode: LEFT_ARROW });
    vi.spyOn(event, 'preventDefault');
    component.slickListEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();

    event = new KeyboardEvent('keydown', { keyCode: RIGHT_ARROW });
    vi.spyOn(event, 'preventDefault');
    component.slickListEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();

    event = new KeyboardEvent('keydown', { keyCode: ENTER });
    vi.spyOn(event, 'preventDefault');
    component.slickListEl.dispatchEvent(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should call layout method when resizing', async () => {
    await stabilize(fixture, 20);
    vi.spyOn(component, 'layout');
    mockObserve$.next();
    await stabilize(fixture, 101);
    expect(component.layout).toHaveBeenCalled();
  });
});

testDirectionality(() => TriTestCarouselBasicComponent, By.directive(TriCarouselComponent), 'ant-carousel');
