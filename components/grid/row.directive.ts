/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReplaySubject, Subject } from 'rxjs';

import { gridResponsiveMap, TriBreakpointKey, TriBreakpointService } from 'ng-zorro-antd/core/services';
import { IndexableObject } from 'ng-zorro-antd/core/types';

export type TriJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
export type TriAlign = 'top' | 'middle' | 'bottom';

@Directive({
  selector: '[tri-row],tri-row,tri-form-item',
  exportAs: 'triRow',
  host: {
    class: 'tri-row',
    '[class.tri-row-top]': `align === 'top'`,
    '[class.tri-row-middle]': `align === 'middle'`,
    '[class.tri-row-bottom]': `align === 'bottom'`,
    '[class.tri-row-start]': `justify === 'start'`,
    '[class.tri-row-end]': `justify === 'end'`,
    '[class.tri-row-center]': `justify === 'center'`,
    '[class.tri-row-space-around]': `justify === 'space-around'`,
    '[class.tri-row-space-between]': `justify === 'space-between'`,
    '[class.tri-row-space-evenly]': `justify === 'space-evenly'`,
    '[class.tri-row-rtl]': `dir === "rtl"`
  }
})
export class TriRowDirective implements OnInit, OnChanges, AfterViewInit {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private mediaMatcher = inject(MediaMatcher);
  private ngZone = inject(NgZone);
  private platform = inject(Platform);
  private breakpointService = inject(TriBreakpointService);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);
  @Input() align: TriAlign | null = null;
  @Input() justify: TriJustify | null = null;
  @Input() gutter: string | number | IndexableObject | [number, number] | [IndexableObject, IndexableObject] | null =
    null;

  readonly actualGutter$ = new ReplaySubject<[number | null, number | null]>(1);

  dir: Direction = 'ltr';
  private readonly destroy$ = new Subject<boolean>();

  getGutter(): [number | null, number | null] {
    const results: [number | null, number | null] = [null, null];
    const gutter = this.gutter || 0;
    const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, null];
    normalizedGutter.forEach((g, index) => {
      if (typeof g === 'object' && g !== null) {
        results[index] = null;
        Object.keys(gridResponsiveMap).map((screen: string) => {
          const bp = screen as TriBreakpointKey;
          if (this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches && g[bp]) {
            results[index] = g![bp] as number;
          }
        });
      } else {
        results[index] = Number(g) || null;
      }
    });
    return results;
  }

  setGutterStyle(): void {
    const [horizontalGutter, verticalGutter] = this.getGutter();
    this.actualGutter$.next([horizontalGutter, verticalGutter]);
    const renderGutter = (name: string, gutter: number | null): void => {
      const nativeElement = this.elementRef.nativeElement;
      if (gutter !== null) {
        this.renderer.setStyle(nativeElement, name, `-${gutter / 2}px`);
      }
    };
    renderGutter('margin-left', horizontalGutter);
    renderGutter('margin-right', horizontalGutter);
    renderGutter('margin-top', verticalGutter);
    renderGutter('margin-bottom', verticalGutter);
  }

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });

    this.setGutterStyle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nzGutter) {
      this.setGutterStyle();
    }
  }

  ngAfterViewInit(): void {
    if (this.platform.isBrowser) {
      this.breakpointService
        .subscribe(gridResponsiveMap)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.setGutterStyle();
        });
    }
  }
}
