/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, ElementRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { vi } from 'vitest';

import {
  TriResizeObserver,
  TriResizeObserverDirective,
  TriResizeObserverFactory
} from 'ng-zorro-antd/cdk/resize-observer';

describe('resize observer', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let resizeEntries$: Subject<ResizeObserverEntry[]>;

  beforeEach(() => {
    resizeEntries$ = new Subject<ResizeObserverEntry[]>();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TriResizeObserver,
          useValue: { observe: () => resizeEntries$ }
        }
      ]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  it('should stop and resume resize events when disabled changes', async () => {
    await fixture.whenStable();

    const initialEntries = [{} as ResizeObserverEntry];
    resizeEntries$.next(initialEntries);
    expect(component.resizeEntries()).toEqual([initialEntries]);

    component.disabled.set(true);
    await fixture.whenStable();

    resizeEntries$.next([{} as ResizeObserverEntry]);
    expect(component.resizeEntries()).toEqual([initialEntries]);

    component.disabled.set(false);
    await fixture.whenStable();

    const resumedEntries = [{} as ResizeObserverEntry];
    resizeEntries$.next(resumedEntries);
    expect(component.resizeEntries()).toEqual([initialEntries, resumedEntries]);
  });
});

@Component({
  template: `
    <div resizeObserver [resizeObserverDisabled]="disabled()" (resizeObserve)="onResize($event)"></div>
  `,
  imports: [TriResizeObserverDirective]
})
class TestHostComponent {
  readonly disabled = signal(false);
  readonly resizeEntries = signal<ResizeObserverEntry[][]>([]);

  onResize(entries: ResizeObserverEntry[]): void {
    this.resizeEntries.update(currentEntries => [...currentEntries, entries]);
  }
}

describe('resize observer service', () => {
  let service: TriResizeObserver;
  let observer: TestResizeObserver;
  let callbacks: ResizeObserverCallback[];
  let create: ReturnType<typeof vi.fn<(callback: ResizeObserverCallback) => ResizeObserver>>;

  beforeEach(() => {
    observer = new TestResizeObserver();
    callbacks = [];
    create = vi.fn(callback => {
      callbacks.push(callback);
      return observer;
    });
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TriResizeObserverFactory,
          useValue: { create }
        }
      ]
    });
    service = TestBed.inject(TriResizeObserver);
  });

  it('should share an observer and disconnect it after the last subscription ends', () => {
    const element = document.createElement('div');
    const firstEntries: ResizeObserverEntry[][] = [];
    const secondEntries: ResizeObserverEntry[][] = [];
    const firstSubscription = service.observe(element).subscribe(entries => firstEntries.push(entries));
    const secondSubscription = service.observe(element).subscribe(entries => secondEntries.push(entries));

    expect(create).toHaveBeenCalledTimes(1);
    expect(observer.observe).toHaveBeenCalledWith(element);

    const entries = [{} as ResizeObserverEntry];
    callbacks[0](entries, observer);
    expect(firstEntries).toEqual([entries]);
    expect(secondEntries).toEqual([entries]);

    firstSubscription.unsubscribe();
    expect(observer.disconnect).not.toHaveBeenCalled();

    secondSubscription.unsubscribe();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });

  it('should accept an ElementRef', () => {
    const element = document.createElement('div');
    const subscription = service.observe(new ElementRef(element)).subscribe();

    expect(observer.observe).toHaveBeenCalledWith(element);

    subscription.unsubscribe();
  });
});

class TestResizeObserver implements ResizeObserver {
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();

  takeRecords(): ResizeObserverEntry[] {
    return [];
  }
}
