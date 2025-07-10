/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export * from './carousel.module';
export * from './carousel.component';
export * from './carousel-content.directive';
export * from './typings';

export * from './strategies/base-strategy';
export { TriCarouselOpacityStrategy } from './strategies/opacity-strategy';
export { TriCarouselTransformStrategy } from './strategies/transform-strategy';
export { TriCarouselTransformNoLoopStrategy } from './strategies/experimental/transform-no-loop-strategy';
export { TriCarouselFlipStrategy } from './strategies/experimental/flip-strategy';
