/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction } from '@angular/cdk/bidi';
import { InjectionToken, TemplateRef, Type } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriDrawerRef } from './drawer-ref';

export const DRAWER_DEFAULT_SIZE = 378;
export const DRAWER_LARGE_SIZE = 736;
export type TriDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type TriDrawerSize = 'default' | 'large';

export interface TriDrawerOptionsOfComponent<T = TriSafeAny, D = TriSafeAny> {
  nzClosable?: boolean;
  nzMaskClosable?: boolean;
  closeOnNavigation?: boolean;
  direction?: Direction;
  nzMask?: boolean;
  nzKeyboard?: boolean;
  nzNoAnimation?: boolean;
  nzTitle?: string | TemplateRef<{}>;
  extra?: string | TemplateRef<{}>;
  footer?: string | TemplateRef<{}>;
  content?: TemplateRef<{ $implicit: D; drawerRef: TriDrawerRef }> | Type<T>;
  /**@Deprecated**/
  contentParams?: Partial<T & D>;
  data?: D;
  nzMaskStyle?: object;
  nzBodyStyle?: object;
  nzWrapClassName?: string;
  size?: TriDrawerSize;
  nzWidth?: number | string;
  nzHeight?: number | string;
  nzPlacement?: TriDrawerPlacement;
  nzZIndex?: number;
  nzOffsetX?: number;
  nzOffsetY?: number;
}

export interface TriDrawerOptions<T = TriSafeAny, D = TriSafeAny> extends TriDrawerOptionsOfComponent<T, D> {
  nzOnCancel?(): Promise<TriSafeAny>;
}

export const NZ_DRAWER_DATA = new InjectionToken<TriSafeAny>('NZ_DRAWER_DATA');
