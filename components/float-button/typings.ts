/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';

import { TriSizeDSType } from 'ng-zorro-antd/core/types';

export type TriFloatButtonType = 'primary' | 'default';

// omit nzShowDot, nzTitle, nzStatus, nzText
export interface TriFloatButtonBadgeProps {
  nzShowZero: boolean;
  nzDot: boolean;
  nzOverflowCount: number;
  nzColor: string;
  nzCount: number | TemplateRef<void>;
  nzOffset: [number, number];
  nzSize: TriSizeDSType;
}

export type TriFloatButtonBadge = Partial<TriFloatButtonBadgeProps>;
