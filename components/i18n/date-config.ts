/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { InjectionToken } from '@angular/core';

import { WeekDayIndex } from 'ng-zorro-antd/core/time';

export interface TriDateConfig {
  /** Customize the first day of a week */
  firstDayOfWeek?: WeekDayIndex;
}

export const NZ_DATE_CONFIG = new InjectionToken<TriDateConfig>('date-config');

export const NZ_DATE_CONFIG_DEFAULT: TriDateConfig = {
  firstDayOfWeek: undefined
};

export function mergeDateConfig(config: TriDateConfig | null): TriDateConfig {
  return { ...NZ_DATE_CONFIG_DEFAULT, ...config };
}
