/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Platform } from '@angular/cdk/platform';
import { Component, DebugElement, SimpleChanges, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { TriScrollService } from 'ng-zorro-antd/core/services';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriBackTopComponent } from './back-top.component';
import { TriBackTopModule } from './back-top.module';

describe('nz-back-top', () => {
  let scrollService: MockNzScrollService;
  let fixture: ComponentFixture<TestBackTopComponent>;
  let debugElement: DebugElement;
  let component: TriBackTopComponent;
  let componentObject: NzBackTopPageObject;
  const defaultVisibilityHeight = 400;

  class NzBackTopPageObject {
    scrollTo(el: Element | Window, scrollTop: number): void {
      scrollService.mockTopOffset = scrollTop;
      el.dispatchEvent(new Event('scroll'));
    }

    clickBackTop(): void {
      this.backTopButton().nativeElement.click();
    }

    backTopButton(): DebugElement {
      return debugElement.query(By.css('.ant-back-top'));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        {
          provide: TriScrollService,
          useClass: MockNzScrollService
        }
      ]
    });

    fixture = TestBed.createComponent(TestBackTopComponent);
    component = fixture.componentInstance.backTopComponent;
    componentObject = new NzBackTopPageObject();
    debugElement = fixture.debugElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrollService = TestBed.inject(TriScrollService) as any;
  });

  describe('[default]', () => {
    it(`should not show when scroll is below ${defaultVisibilityHeight}`, fakeAsync(() => {
      componentObject.scrollTo(window, defaultVisibilityHeight - 1);
      tick();
      fixture.detectChanges();
      expect(componentObject.backTopButton() === null).toBe(true);
    }));

    it(`should not show when scroll is at ${defaultVisibilityHeight}`, fakeAsync(() => {
      componentObject.scrollTo(window, defaultVisibilityHeight);
      tick();
      fixture.detectChanges();

      expect(componentObject.backTopButton() === null).toBe(true);
    }));

    describe(`when scrolled at least ${defaultVisibilityHeight + 1}`, () => {
      beforeEach(fakeAsync(() => {
        componentObject.scrollTo(window, defaultVisibilityHeight + 1);
        tick();
        fixture.detectChanges();
      }));

      it(`should show back to top button`, () => {
        expect(componentObject.backTopButton() === null).toBe(false);
      });

      it(`should show default template`, () => {
        expect(debugElement.query(By.css('.ant-back-top-content')) === null).toBe(false);
      });

      it(`should scroll to top when button is clicked`, fakeAsync(() => {
        componentObject.clickBackTop();
        tick();

        expect(scrollService.getScroll()).toEqual(0);
      }));
    });
  });

  describe('[nzVisibilityHeight]', () => {
    const customVisibilityHeight = 100;

    beforeEach(() => {
      component.visibilityHeight = customVisibilityHeight;
    });

    it(`should not show when scroll is below ${customVisibilityHeight}`, fakeAsync(() => {
      componentObject.scrollTo(window, customVisibilityHeight - 1);
      tick();
      fixture.detectChanges();

      expect(componentObject.backTopButton() === null).toBe(true);
    }));

    it(`should not show when scroll is at ${customVisibilityHeight}`, fakeAsync(() => {
      componentObject.scrollTo(window, customVisibilityHeight);
      tick();
      fixture.detectChanges();

      expect(componentObject.backTopButton() === null).toBe(true);
    }));

    describe(`when scrolled at least ${customVisibilityHeight + 1}`, () => {
      beforeEach(fakeAsync(() => {
        componentObject.scrollTo(window, customVisibilityHeight + 1);
        tick();
        fixture.detectChanges();
      }));

      it(`should show back to top button`, () => {
        expect(componentObject.backTopButton() === null).toBe(false);
      });
    });
  });

  describe('(nzClick)', () => {
    beforeEach(fakeAsync(() => {
      componentObject.scrollTo(window, defaultVisibilityHeight + 1);
      tick();
      fixture.detectChanges();
    }));

    describe('when clicked', () => {
      it(`emit event on nzClick`, fakeAsync(() => {
        component.click.subscribe((returnValue: boolean) => {
          expect(returnValue).toBe(true);
        });

        componentObject.clickBackTop();
      }));
    });

    describe('change detection behavior', () => {
      it('should emit click event only when there are subscribers', fakeAsync(() => {
        const emitSpy = spyOn(component.click, 'emit');

        const backTopButton = componentObject.backTopButton().nativeElement;
        backTopButton.dispatchEvent(new MouseEvent('click'));
        tick();

        expect(emitSpy).not.toHaveBeenCalled();

        const subscription = component.click.subscribe();

        backTopButton.dispatchEvent(new MouseEvent('click'));
        tick();

        expect(emitSpy).toHaveBeenCalledWith(true);

        subscription.unsubscribe();
      }));
    });
  });

  describe('[nzTarget]', () => {
    let fakeTarget: HTMLElement;
    beforeEach(() => {
      fakeTarget = debugElement.query(By.css('#fakeTarget')).nativeElement;
      fixture.componentInstance.setTarget(fakeTarget);
      fixture.detectChanges();
    });

    it('window scroll does not show the button', fakeAsync(() => {
      componentObject.scrollTo(window, defaultVisibilityHeight + 1);
      tick();
      fixture.detectChanges();

      expect(componentObject.backTopButton() === null).toBe(true);
    }));

    it('element scroll shows the button', (done: () => void) => {
      componentObject.scrollTo(fakeTarget, defaultVisibilityHeight + 1);
      fixture.detectChanges();

      setTimeout(() => {
        expect(componentObject.backTopButton() === null).toBe(false);
        done();
      }, 50);
    });

    it('element (use string id) scroll shows the button', (done: () => void) => {
      component.target = '#fakeTarget';

      componentObject.scrollTo(fakeTarget, defaultVisibilityHeight + 1);
      fixture.detectChanges();

      setTimeout(() => {
        expect(componentObject.backTopButton() === null).toBe(false);
        done();
      }, 50);
    });
  });

  describe('#nzTemplate', () => {
    it(`should show custom template`, fakeAsync(() => {
      const fixture = TestBed.createComponent(TestBackTopTemplateComponent);

      componentObject.scrollTo(window, defaultVisibilityHeight + 1);
      tick();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.this-is-my-template')) === null).toBe(false);
    }));
  });
});

@Component({
  imports: [TriBackTopModule],
  template: `
    <tri-back-top [target]="target"></tri-back-top>
    <div id="fakeTarget"></div>
  `
})
class TestBackTopComponent {
  @ViewChild(TriBackTopComponent, { static: true })
  backTopComponent!: TriBackTopComponent;

  target: HTMLElement | undefined = undefined;

  setTarget(target: HTMLElement): void {
    this.target = target;
  }
}

@Component({
  imports: [TriBackTopModule],
  template: `
    my comp
    <tri-back-top [template]="tpl">
      <ng-template #tpl>
        <div class="this-is-my-template"></div>
      </ng-template>
    </tri-back-top>
  `
})
class TestBackTopTemplateComponent {
  @ViewChild(TriBackTopComponent, { static: false })
  backTopComponent!: TriBackTopComponent;
}

class MockNzScrollService {
  mockTopOffset: number = 0;

  getScroll(): number {
    return this.mockTopOffset;
  }

  scrollTo(_containerEl: Element | Window, targetTopValue: number = 0): void {
    this.mockTopOffset = targetTopValue;
  }
}

class MockDirectionality {
  value = 'ltr';
  change = new Subject();
}

describe('back-to-top', () => {
  let component: TriBackTopComponent;
  let fixture: ComponentFixture<TriBackTopComponent>;
  let mockDirectionality: MockDirectionality;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Directionality,
          useClass: MockDirectionality
        },
        { provide: Platform, useValue: { isBrowser: false } },
        { provide: Document, useValue: document }
      ]
    });

    fixture = TestBed.createComponent(TriBackTopComponent);
    component = fixture.componentInstance;
    mockDirectionality = TestBed.inject(Directionality) as unknown as MockDirectionality;
  });

  it('dir change should work properly', fakeAsync(() => {
    spyOn<TriSafeAny>(component['cdr'], 'detectChanges');
    mockDirectionality.value = 'ltr';
    component.ngOnInit();
    expect(component.dir).toEqual('ltr');

    mockDirectionality.change.next('rtl');
    tick();
    expect(component.dir).toEqual('rtl');
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  }));

  it('should return if platform is not browser', () => {
    spyOn<TriSafeAny>(component, 'handleScroll');
    component['registerScrollEvent']();

    expect(component['handleScroll']).not.toHaveBeenCalled();
  });

  it('should set correct value for target', fakeAsync(() => {
    spyOn<TriSafeAny>(component, 'registerScrollEvent');
    spyOn(document, 'querySelector').and.returnValue({} as HTMLElement);
    const mockTarget: TriSafeAny = 'mockTarget';
    component.target = mockTarget;
    const change: SimpleChanges = {
      nzTarget: {
        currentValue: mockTarget,
        previousValue: undefined,
        firstChange: false,
        isFirstChange: function (): boolean {
          throw new Error('Function not implemented.');
        }
      }
    };
    component.ngOnChanges(change);
    tick();

    expect(document.querySelector).toHaveBeenCalledWith(mockTarget);
    expect(component['target']).toBeTruthy();
    expect(component['registerScrollEvent']).toHaveBeenCalled();
  }));
});
