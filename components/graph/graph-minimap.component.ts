/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, NgZone } from '@angular/core';

import type { ZoomBehavior } from 'd3-zoom';

import type { TriSafeAny } from 'ng-zorro-antd/core/types';

import { Minimap } from './core/minimap';
import { TriZoomTransform } from './interface';

@Component({
  selector: 'tri-graph-minimap',
  template: `
    <svg>
      <defs>
        <filter id="minimapDropShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feOffset result="offOut" in="SourceGraphic" dx="1" dy="1"></feOffset>
          <feColorMatrix
            result="matrixOut"
            in="offOut"
            type="matrix"
            values="0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.5 0"
          ></feColorMatrix>
          <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2"></feGaussianBlur>
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal"></feBlend>
        </filter>
      </defs>
      <rect></rect>
    </svg>
    <canvas class="viewport"></canvas>
    <!-- Additional canvas to use as buffer to avoid flickering between updates -->
    <canvas class="buffer"></canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.nz-graph-minimap]': 'true'
  }
})
export class TriGraphMinimapComponent {
  private elementRef = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  minimap?: Minimap;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.minimap?.destroy();
    });
  }

  init(containerEle: ElementRef, zoomBehavior: ZoomBehavior<TriSafeAny, TriSafeAny>): void {
    const svgEle = containerEle.nativeElement.querySelector('svg');
    const zoomEle = containerEle.nativeElement.querySelector('svg > g');
    this.minimap = new Minimap(this.ngZone, svgEle, zoomEle, zoomBehavior, this.elementRef.nativeElement, 150, 0);
  }

  zoom(transform: TriZoomTransform): void {
    this.minimap?.zoom(transform);
  }

  update(): void {
    this.minimap?.update();
  }
}
