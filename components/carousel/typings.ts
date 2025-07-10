/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import { InjectionToken, NgZone, QueryList } from '@angular/core';

import { TriCarouselContentDirective } from './carousel-content.directive';
import { TriCarouselBaseStrategy } from './strategies/base-strategy';

export type TriCarouselEffects = 'fade' | 'scrollx' | string;
export type TriCarouselDotPosition = 'top' | 'bottom' | 'left' | 'right' | string;

export interface TriCarouselComponentAsSource {
  carouselContents: QueryList<TriCarouselContentDirective>;
  el: HTMLElement;
  nzTransitionSpeed: number;
  vertical: boolean;
  slickListEl: HTMLElement;
  slickTrackEl: HTMLElement;
  activeIndex: number;
  dir: Direction;
  ngZone: NgZone;
}

export interface TriCarouselStrategyRegistryItem {
  name: string;
  strategy: TriCarouselBaseStrategy;
}

export const NZ_CAROUSEL_CUSTOM_STRATEGIES = new InjectionToken<TriCarouselStrategyRegistryItem[]>(
  'nz-carousel-custom-strategies'
);

export interface PointerVector {
  x: number;
  y: number;
}

export interface FromToInterface {
  from: number;
  to: number;
}
