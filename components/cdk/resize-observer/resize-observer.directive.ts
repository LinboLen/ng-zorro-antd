/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { TriResizeObserver } from './resize-observer.service';

@Directive({
  selector: '[triResizeObserver]'
})
export class TriResizeObserverDirective implements AfterContentInit, OnChanges {
  private readonly resizeObserver = inject(TriResizeObserver);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  @Input({ transform: booleanAttribute }) resizeObserverDisabled = false;
  @Output() readonly resizeObserve = new EventEmitter<ResizeObserverEntry[]>();

  private currentSubscription: Subscription | null = null;

  private subscribe(): void {
    this.unsubscribe();
    this.currentSubscription = this.resizeObserver.observe(this.elementRef).subscribe(this.resizeObserve);
  }

  private unsubscribe(): void {
    this.currentSubscription?.unsubscribe();
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.unsubscribe());
  }

  ngAfterContentInit(): void {
    if (!this.currentSubscription && !this.resizeObserverDisabled) {
      this.subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzResizeObserverDisabled } = changes;
    if (nzResizeObserverDisabled) {
      if (this.resizeObserverDisabled) {
        this.unsubscribe();
      } else {
        this.subscribe();
      }
    }
  }
}
