/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectorRef, Directive, ElementRef, inject } from '@angular/core';
import { distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { TriResizeObserver } from 'ng-zorro-antd/cdk/resize-observer';

@Directive({
  selector: '[triOverflowItem]',
  host: {
    '[style]': 'overflowStyle'
  }
})
export class TriOverflowItemDirective {
  private resizeObserver = inject(TriResizeObserver);
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  overflowStyle: Record<string, string | number | undefined> | undefined = undefined;
  itemWidth$ = this.resizeObserver.observe(this.elementRef.nativeElement).pipe(
    map(([item]) => (item.target as HTMLElement).offsetWidth),
    distinctUntilChanged(),
    startWith(undefined),
    tap(width => {
      this.itemWidth = width;
    })
  );
  itemWidth: number | undefined = undefined;

  setItemStyle(display: boolean, order: number): void {
    const mergedHidden = !display;
    this.overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : undefined,
      overflowY: mergedHidden ? 'hidden' : undefined,
      order: order,
      pointerEvents: mergedHidden ? 'none' : undefined,
      position: mergedHidden ? 'absolute' : undefined
    };
    this.cdr.detectChanges();
  }
}
