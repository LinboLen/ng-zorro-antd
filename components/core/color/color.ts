/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TriSafeAny } from 'ng-zorro-antd/core/types';

export const statusColors = ['success', 'processing', 'error', 'default', 'warning'] as const;

export const presetColors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime'
] as const;

export type TriPresetColor = (typeof presetColors)[number];
export type TriStatusColor = (typeof statusColors)[number];

export function isPresetColor(color: string): color is TriPresetColor {
  return presetColors.indexOf(color as TriSafeAny) !== -1;
}

export function isStatusColor(color: string): color is TriPresetColor {
  return statusColors.indexOf(color as TriSafeAny) !== -1;
}
