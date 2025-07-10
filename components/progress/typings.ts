/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';

import { NgStyleInterface } from 'ng-zorro-antd/core/types';

export type TriProgressGapPositionType = 'top' | 'bottom' | 'left' | 'right';

export type TriProgressStatusType = 'success' | 'exception' | 'active' | 'normal';

export type TriProgressTypeType = 'line' | 'circle' | 'dashboard';

export type TriProgressStrokeLinecapType = 'round' | 'square';

export interface TriProgressGradientProgress {
  [percent: string]: string;
}

export interface TriProgressGradientFromTo {
  from: string;
  to: string;
}

export type TriProgressColorGradient = { direction?: string } & (TriProgressGradientProgress | TriProgressGradientFromTo);

export type TriProgressStrokeColorType = string | TriProgressColorGradient;

export type TriProgressFormatter = ((percent: number) => string | null) | TemplateRef<{ $implicit: number }>;

export interface TriProgressCirclePath {
  stroke: string | null;
  strokePathStyle: NgStyleInterface;
}

export interface TriProgressStepItem {
  backgroundColor: string;
  width: string;
  height: string;
}
