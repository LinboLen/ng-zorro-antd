/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, EventEmitter, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { TriResizeObserverDirective } from 'ng-zorro-antd/cdk/resize-observer/resize-observer.directive';
import { TriSafeAny } from 'ng-zorro-antd/core/types';

describe('resize observer', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: TriResizeObserverDirective;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    directive = fixture.debugElement.children[0].injector.get(TriResizeObserverDirective);
  });

  it('should have correct initial values', () => {
    expect(directive.resizeObserve).toBeDefined();
    expect(directive.resizeObserve).toBeInstanceOf(EventEmitter);

    expect(directive.resizeObserverDisabled).toEqual(false);

    expect(directive['currentSubscription']).toEqual(null);
  });

  it('should call subscribe when all the conditions are met', () => {
    directive['currentSubscription'] = null;
    directive.resizeObserverDisabled = false;
    spyOn<TriSafeAny>(directive, 'subscribe');
    directive.ngAfterContentInit();
    expect(directive['subscribe']).toHaveBeenCalled();
  });

  it('should not call subscribe when nzResizeObserverDisabled is true', () => {
    directive['currentSubscription'] = null;
    directive.resizeObserverDisabled = true;
    spyOn<TriSafeAny>(directive, 'subscribe');
    directive.ngAfterContentInit();
    expect(directive['subscribe']).not.toHaveBeenCalled();
  });

  it('should not call subscribe when currentSubscription is truthy', () => {
    directive['currentSubscription'] = new Subscription();
    directive.resizeObserverDisabled = false;
    spyOn<TriSafeAny>(directive, 'subscribe');
    directive.ngAfterContentInit();
    expect(directive['subscribe']).not.toHaveBeenCalled();
  });

  it('should call unsubscribe when nzResizeObserve is changed and nzResizeObserverDisabled is true', () => {
    const change = {
      nzResizeObserve: {}
    };
    spyOn<TriSafeAny>(directive, 'unsubscribe');
    directive.resizeObserverDisabled = true;
    directive.ngOnChanges(change as unknown as SimpleChanges);
    expect(directive['unsubscribe']).toHaveBeenCalled();
  });

  it('should call subscribe when nzResizeObserve is changed and nzResizeObserverDisabled is false', () => {
    const change = {
      nzResizeObserve: {}
    };
    spyOn<TriSafeAny>(directive, 'subscribe');
    directive.resizeObserverDisabled = false;
    directive.ngOnChanges(change as unknown as SimpleChanges);
    expect(directive['subscribe']).toHaveBeenCalled();
  });

  it('should call correct methods when calling subscribe', () => {
    spyOn<TriSafeAny>(directive, 'unsubscribe');
    directive['subscribe']();
    expect(directive['unsubscribe']).toHaveBeenCalled();
  });

  it('should destroy the observedElements', () => {
    const element = document.createElement('div');
    directive['nzResizeObserver'].observe(element);
    fixture.detectChanges();
    spyOn<TriSafeAny>(directive['nzResizeObserver'], 'cleanupObserver');
    fixture.destroy();
    expect(directive['nzResizeObserver']['cleanupObserver']).toHaveBeenCalled();
  });

  it('should return correct resizeObserver if it is supported', () => {
    // eslint-disable-next-line no-global-assign
    ResizeObserver = undefined as TriSafeAny;
    const result = directive['nzResizeObserver']['nzResizeObserverFactory'].create(jasmine.createSpy('callback'));
    expect(result).toEqual(null);
  });
});

@Component({
  template: `<div resizeObserver></div>`,
  imports: [TriResizeObserverDirective]
})
class TestHostComponent {}
