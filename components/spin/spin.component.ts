/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  numberAttribute,
  inject,
  DestroyRef,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import { TriSafeAny, TriSizeLDSType } from 'ng-zorro-antd/core/types';

const NZ_CONFIG_MODULE_NAME: TriConfigKey = 'spin';

@Component({
  selector: '',
  exportAs: 'triSpin',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #defaultTemplate>
      <span class="tri-spin-dot tri-spin-dot-spin">
        <i class="tri-spin-dot-item"></i>
        <i class="tri-spin-dot-item"></i>
        <i class="tri-spin-dot-item"></i>
        <i class="tri-spin-dot-item"></i>
      </span>
    </ng-template>
    @if (isLoading()) {
      <div>
        <div
          class="tri-spin tri-spin-spinning"
          [class.tri-spin-rtl]="dir === 'rtl'"
          [class.tri-spin-lg]="size === 'large'"
          [class.tri-spin-sm]="size === 'small'"
          [class.tri-spin-show-text]="tip"
        >
          <ng-template [ngTemplateOutlet]="indicator || defaultTemplate"></ng-template>
          @if (tip) {
            <div class="tri-spin-text">{{ tip }}</div>
          }
        </div>
      </div>
    }
    @if (!simple) {
      <div class="tri-spin-container" [class.tri-spin-blur]="isLoading()">
        <ng-content></ng-content>
      </div>
    }
  `,
  host: {
    '[class.tri-spin-nested-loading]': '!simple'
  },
  imports: [NgTemplateOutlet]
})
export class TriSpinComponent implements OnChanges, OnInit {
  readonly _nzModuleName: TriConfigKey = NZ_CONFIG_MODULE_NAME;

  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  @Input() @WithConfig() indicator: TemplateRef<TriSafeAny> | null = null;
  @Input() size: TriSizeLDSType = 'default';
  @Input() tip: string | null = null;
  @Input({ transform: numberAttribute }) delay = 0;
  @Input({ transform: booleanAttribute }) simple = false;
  @Input({ transform: booleanAttribute }) spinning = true;
  private spinning$ = new BehaviorSubject(this.spinning);
  private delay$ = new ReplaySubject<number>(1);

  readonly isLoading = signal(false);

  dir: Direction = 'ltr';

  constructor() {
    onConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  ngOnInit(): void {
    this.delay$
      .pipe(
        startWith(this.delay),
        distinctUntilChanged(),
        switchMap(delay =>
          // This construct is used to reduce RxJS dependencies.
          // It previously used `debounce(() => timer())`, but consumers may not
          // use these RxJS functions at all, causing them to still be bundled
          // into the main bundle unnecessarily.
          this.spinning$.pipe(
            switchMap(spinning => {
              if (delay === 0 || !spinning) {
                return of(spinning);
              }
              return new Observable<boolean>(subscriber => {
                const timeoutId = setTimeout(() => subscriber.next(spinning), delay);
                return () => clearTimeout(timeoutId);
              });
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(isLoading => {
        this.isLoading.set(isLoading);
      });

    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzSpinning, nzDelay } = changes;
    if (nzSpinning) {
      this.spinning$.next(this.spinning);
    }
    if (nzDelay) {
      this.delay$.next(this.delay);
    }
  }
}
