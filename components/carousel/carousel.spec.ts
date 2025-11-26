/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { ENTER, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Component, DebugElement, provideZoneChangeDetection, ViewChild } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';
import { dispatchKeyboardEvent, dispatchMouseEvent } from 'ng-zorro-antd/core/testing';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriCarouselContentDirective } from './carousel-content.directive';
import { TriCarouselComponent } from './carousel.component';
import { TriCarouselModule } from './carousel.module';
import { TriCarouselFlipStrategy } from './strategies/experimental/flip-strategy';
import { TriCarouselTransformNoLoopStrategy } from './strategies/experimental/transform-no-loop-strategy';
import { TRI_CAROUSEL_CUSTOM_STRATEGIES } from './typings';

describe('carousel', () => {
  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

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

    it('should dynamic change content work', fakeAsync(() => {
      fixture.detectChanges();
      tick(3000);
      fixture.detectChanges();
      expect(carouselContents.length).toBe(4);
      testComponent.array = [];
      fixture.detectChanges();
      tick(3000);
      fixture.detectChanges();
      carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));
      expect(carouselContents.length).toBe(0);
    }));

    it('should nzDots work', () => {
      fixture.detectChanges();
      expect(testComponent.dots).toBe(true);
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').children.length).toBe(4);
      testComponent.dots = false;
      fixture.detectChanges();
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots')).toBeNull();
    });

    it('should nzDotRender work', () => {
      fixture.detectChanges();
      expect(testComponent.dots).toBe(true);
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').children.length).toBe(4);
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').firstElementChild.innerText).toBe('1');
      expect(carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.innerText).toBe('4');
      expect(
        carouselWrapper.nativeElement.querySelector('.slick-dots').firstElementChild.firstElementChild.tagName
      ).toBe('A');
    });

    it('should call layout on component resize', fakeAsync(() => {
      testComponent.carouselComponent.ngOnInit();
      const spy = spyOn(testComponent.carouselComponent, 'layout');
      window.dispatchEvent(new Event('resize'));
      tick(500);

      (testComponent.carouselComponent['nzResizeObserver'] as TriResizeObserver)
        .observe(testComponent.carouselComponent.el)
        .subscribe(() => {
          expect(spy).toHaveBeenCalled();
        });
    }));

    it('should call layout on component resize', fakeAsync(() => {
      const spyOnResize = spyOn(testComponent.carouselComponent, 'layout');
      window.dispatchEvent(new Event('resize'));
      tick(500);

      expect(spyOnResize).toHaveBeenCalled();
      discardPeriodicTasks();
    }));

    it('should click content change', () => {
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      fixture.detectChanges();
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    });

    it('should keydown change content work', fakeAsync(() => {
      fixture.detectChanges();
      const list = carouselWrapper.nativeElement.querySelector('.slick-list');

      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

      dispatchKeyboardEvent(list, 'keydown', LEFT_ARROW);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      dispatchKeyboardEvent(list, 'keydown', LEFT_ARROW);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[2].nativeElement.classList).toContain('slick-active');
      dispatchKeyboardEvent(list, 'keydown', RIGHT_ARROW);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      dispatchKeyboardEvent(list, 'keydown', RIGHT_ARROW);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    }));

    it('should nzDotPosition work', () => {
      testComponent.dotPosition = 'left';
      fixture.detectChanges();
      expect(carouselWrapper.nativeElement.firstElementChild!.classList).toContain('slick-vertical');
    });

    it('should effect change work', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).toBe(
        'translate3d(0px, 0px, 0px)'
      );
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      tickMilliseconds(fixture, 700);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe('');

      testComponent.effect = 'fade';
      testComponent.dotPosition = 'left';
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      tickMilliseconds(fixture, 700);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).toBe('');

      testComponent.effect = 'scrollx';
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      tickMilliseconds(fixture, 700);
      expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe(
        'translate3d(0px, 0px, 0px)'
      );
    }));

    it('should autoplay work', fakeAsync(() => {
      testComponent.autoPlay = true;
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      fixture.detectChanges();
      tick(5000);
      fixture.detectChanges();
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
      carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
      fixture.detectChanges();
      tick(5000);
      fixture.detectChanges();
      testComponent.autoPlay = false;
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    }));

    it('should autoplay speed work', fakeAsync(() => {
      testComponent.autoPlay = true;
      testComponent.autoPlaySpeed = 1000;
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      fixture.detectChanges();
      tick(1000 + 10);
      fixture.detectChanges();
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
      testComponent.autoPlaySpeed = 0;
      fixture.detectChanges();
      tick(2000 + 10);
      fixture.detectChanges();
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
    }));

    it('should func work', fakeAsync(() => {
      fixture.detectChanges();
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      testComponent.carouselComponent.next();
      tickMilliseconds(fixture, 700);
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
      testComponent.carouselComponent.pre();
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      testComponent.carouselComponent.goTo(2);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[2].nativeElement.classList).toContain('slick-active');
    }));

    it('should resize content after window resized', fakeAsync(() => {
      const resizeSpy = spyOn(testComponent.carouselComponent.strategy!, 'withCarouselContents');
      window.dispatchEvent(new Event('resize'));
      tick(16);
      expect(resizeSpy).toHaveBeenCalledTimes(1);
    }));

    // this test may fail on WSL
    it('should support swiping to switch', fakeAsync(() => {
      swipe(testComponent.carouselComponent, 500);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).not.toContain('slick-active');
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');

      swipe(testComponent.carouselComponent, -500);
      tickMilliseconds(fixture, 700);
      swipe(testComponent.carouselComponent, -500);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).not.toContain('slick-active');
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    }));

    it('should prevent swipes that are not long enough', fakeAsync(() => {
      swipe(testComponent.carouselComponent, 57);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    }));

    it('should disable dragging during transitioning', fakeAsync(() => {
      tickMilliseconds(fixture, 700);
      testComponent.carouselComponent.goTo(1);
      swipe(testComponent.carouselComponent, 500);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
    }));

    it('should disable loop work', fakeAsync(() => {
      testComponent.loop = false;
      fixture.detectChanges();
      swipe(testComponent.carouselComponent, -10);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
      swipe(testComponent.carouselComponent, -1000);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

      testComponent.loop = true;
      fixture.detectChanges();
      swipe(testComponent.carouselComponent, -1000);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      swipe(testComponent.carouselComponent, 1000);
      tickMilliseconds(fixture, 700);
      expect(carouselContents[0].nativeElement.classList).toContain('slick-active');

      testComponent.loop = false;
      testComponent.autoPlay = true;
      testComponent.autoPlaySpeed = 1000;
      fixture.detectChanges();
      tick(10000);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
      tick(1000 + 10);
      expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    }));

    it('should call goTo function on slick dot click', () => {
      spyOn(testComponent.carouselComponent, 'goTo');
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
      it('horizontal transform', fakeAsync(() => {
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.next();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.pre();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        // From first to last.
        testComponent.carouselComponent.pre();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        // From last to first.
        testComponent.carouselComponent.next();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);
      }));

      it('vertical', fakeAsync(() => {
        testComponent.dotPosition = 'left';
        fixture.detectChanges();

        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.next();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.el.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        testComponent.carouselComponent.pre();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);

        // From first to last.
        testComponent.carouselComponent.pre();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).not.toBe(`translate3d(0px, 0px, 0px)`);

        // From last to first.
        testComponent.carouselComponent.next();
        tickMilliseconds(fixture, 700);
        expect(testComponent.carouselComponent.slickTrackEl.style.transform).toBe(`translate3d(0px, 0px, 0px)`);
      }));
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

    it('carousel activeIndex should be equal to nzAfterChange return value', fakeAsync(() => {
      fixture.detectChanges();
      [0, 1, 2, 3, 4].forEach(_ => {
        testComponent.carouselComponent.next();
        tickMilliseconds(fixture, 700);
        expect(testComponent.index).toBe(testComponent.carouselComponent.activeIndex);
      });
    }));
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

  it('could use custom strategies', fakeAsync(() => {
    fixture = TestBed.createComponent(TriTestCarouselBasicComponent);
    fixture.detectChanges();
    testComponent = fixture.debugElement.componentInstance;
    carouselWrapper = fixture.debugElement.query(By.directive(TriCarouselComponent));
    carouselContents = fixture.debugElement.queryAll(By.directive(TriCarouselContentDirective));

    testComponent.effect = 'flip';
    fixture.detectChanges();
    expect(carouselContents[0].nativeElement.style.transform).toBe('rotateY(0deg)');
    expect(carouselContents[1].nativeElement.style.transform).toBe('rotateY(180deg)');
    carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
    tickMilliseconds(fixture, 700);
    expect(carouselContents[0].nativeElement.style.transform).toBe('rotateY(180deg)');
    expect(carouselContents[3].nativeElement.style.transform).toBe('rotateY(0deg)');

    testComponent.effect = 'transform-no-loop';
    fixture.detectChanges();
    expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).toBe(
      'translate3d(0px, 0px, 0px)'
    );
    carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
    tickMilliseconds(fixture, 700);
    expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe(
      'translate3d(0px, 0px, 0px)'
    );

    testComponent.dotPosition = 'left';
    fixture.detectChanges();
    carouselWrapper.nativeElement.querySelector('.slick-dots').lastElementChild.click();
    tickMilliseconds(fixture, 700);
    expect(carouselWrapper.nativeElement.querySelector('.slick-track').style.transform).not.toBe(
      'translate3d(0px, 0px, 0px)'
    );
  }));
});

describe('carousel arrows', () => {
  let fixture: ComponentFixture<TriTestCarouselArrowsComponent>;
  let testComponent: TriTestCarouselArrowsComponent;
  let carouselWrapper: DebugElement;
  let carouselContents: DebugElement[];

  beforeEach(() => {
    // todo: use zoneless
    TestBed.configureTestingModule({
      providers: [provideZoneChangeDetection()]
    });
  });

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

  it('should navigate via arrows', fakeAsync(() => {
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    carouselWrapper.nativeElement.querySelector('.slick-next').click();
    tickMilliseconds(fixture, 700);
    expect(carouselContents[1].nativeElement.classList).toContain('slick-active');
    carouselWrapper.nativeElement.querySelector('.slick-prev').click();
    tickMilliseconds(fixture, 700);
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
  }));

  it('should disable arrows at edges when loop is false', fakeAsync(() => {
    testComponent.loop = false;
    fixture.detectChanges();
    const prev = carouselWrapper.nativeElement.querySelector('.slick-prev');
    const next = carouselWrapper.nativeElement.querySelector('.slick-next');
    expect(prev.classList).toContain('slick-disabled');
    expect(next.classList).not.toContain('slick-disabled');

    // Go to last slide
    for (let i = 0; i < 3; i++) {
      next.click();
      tickMilliseconds(fixture, 700);
    }
    expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
    expect(next.classList).toContain('slick-disabled');

    // Clicking next should not move beyond last
    next.click();
    tickMilliseconds(fixture, 700);
    expect(carouselContents[3].nativeElement.classList).toContain('slick-active');
  }));
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

  it('should not change slide on swipe when nzEnableSwipe is false', fakeAsync(() => {
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
    swipe(testComponent.carouselComponent, 500);
    tickMilliseconds(fixture, 700);
    expect(carouselContents[0].nativeElement.classList).toContain('slick-active');
  }));
});

function tickMilliseconds<T>(fixture: ComponentFixture<T>, seconds: number = 1): void {
  fixture.detectChanges();
  tick(seconds);
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
      [effect]="effect"
      [dots]="dots"
      [dotPosition]="dotPosition"
      [dotRender]="dotRender"
      [autoPlay]="autoPlay"
      [autoPlaySpeed]="autoPlaySpeed"
      [loop]="loop"
      (afterChange)="afterChange($event)"
      (beforeChange)="beforeChange($event)"
    >
      @for (index of array; track index) {
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
  dots = true;
  dotPosition = 'bottom';
  effect = 'scrollx';
  array = [1, 2, 3, 4];
  autoPlay = false;
  autoPlaySpeed = 3000;
  loop = true;
  afterChange = jasmine.createSpy('afterChange callback');
  beforeChange = jasmine.createSpy('beforeChange callback');
}

@Component({
  imports: [TriCarouselModule],
  template: `
    <tri-carousel (afterChange)="afterChange($event)">
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
    <tri-carousel [arrows]="true" [loop]="loop">
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
  loop = true;
}

@Component({
  selector: 'tri-test-carousel-no-swipe',
  imports: [TriCarouselModule],
  template: `
    <tri-carousel [enableSwipe]="false">
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

class MockDirectionality {
  value = 'ltr';
  change = new Subject();
}

describe('carousel', () => {
  let fixture: ComponentFixture<TriCarouselComponent>;
  let component: TriCarouselComponent;
  let mockDirectionality: MockDirectionality;
  let mockObserve$: Subject<void>;

  beforeEach(() => {
    mockObserve$ = new Subject();
    const nzResizeObserverSpy = jasmine.createSpyObj('NzResizeObserver', {
      observe: mockObserve$.asObservable()
    });

    TestBed.configureTestingModule({
      providers: [
        // todo: use zoneless
        provideZoneChangeDetection(),
        {
          provide: Directionality,
          useClass: MockDirectionality
        },
        {
          provide: TriResizeObserver,
          useValue: nzResizeObserverSpy
        }
      ]
    });

    fixture = TestBed.createComponent(TriCarouselComponent);
    component = fixture.componentInstance;
    mockDirectionality = TestBed.inject(Directionality) as unknown as MockDirectionality;
  });

  it('directionality change detection', fakeAsync(() => {
    spyOn<TriSafeAny>(component, 'markContentActive');
    spyOn<TriSafeAny>(component['cdr'], 'detectChanges');
    mockDirectionality.value = 'ltr';
    component.ngOnInit();
    expect(component.dir).toEqual('ltr');

    mockDirectionality.change.next('rtl');
    tick();
    expect(component.dir).toEqual('rtl');
    expect(component['markContentActive']).toHaveBeenCalled();
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  }));

  it('should not execute if keyCode is not of type LEFT_ARROW  or RIGHT_ARROW', fakeAsync(() => {
    component.ngOnInit();
    tick(1);
    let event: KeyboardEvent;

    event = new KeyboardEvent('keydown', { keyCode: LEFT_ARROW });
    spyOn(event, 'preventDefault');
    component.slickListEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();

    event = new KeyboardEvent('keydown', { keyCode: RIGHT_ARROW });
    spyOn(event, 'preventDefault');
    component.slickListEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();

    event = new KeyboardEvent('keydown', { keyCode: ENTER });
    spyOn(event, 'preventDefault');
    component.slickListEl.dispatchEvent(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  }));

  it('should call layout method when resizing', fakeAsync(() => {
    spyOn(component, 'layout');
    component.ngOnInit();
    tick(1);
    mockObserve$.next();
    tick(101);
    expect(component.layout).toHaveBeenCalled();
  }));
});
