/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Observable } from 'rxjs';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

export type TriTabPosition = 'top' | 'bottom' | 'left' | 'right';
export type TriTabType = 'line' | 'card' | 'editable-card';
export type TriTabsCanDeactivateFn = (
  fromIndex: number,
  toIndex: number
) => Observable<boolean> | Promise<boolean> | boolean;
export type TriTabPositionMode = 'horizontal' | 'vertical';

export interface TriAnimatedInterface {
  inkBar: boolean;
  tabPane: boolean;
}

export class TriTabChangeEvent {
  index?: number;
  tab: TriSafeAny;
}

export interface TriTabScrollListOffset {
  x: number;
  y: number;
}

export type TriTabScrollListOffsetEvent = TriTabScrollListOffset & { event: Event };

interface TriTabWheelScrollEvent {
  type: 'wheel';
  event: WheelEvent;
}

interface TriTabTouchScrollEvent {
  type: 'touchstart' | 'touchmove' | 'touchend';
  event: TouchEvent;
}

export type TriTabScrollEvent = TriTabTouchScrollEvent | TriTabWheelScrollEvent;
export type TriTabScrollEventHandlerFun<T extends TriTabScrollEvent['event']> = (event: T) => void;

export interface TabTemplateContext {
  visible: boolean;
}
