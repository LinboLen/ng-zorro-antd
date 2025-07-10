/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { TemplateRef } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

export type TriSelectModeType = 'default' | 'multiple' | 'tags';
export interface TriSelectItemInterface {
  template?: TemplateRef<TriSafeAny> | null;
  nzLabel: string | number | null;
  nzValue: TriSafeAny | null;
  nzTitle?: string | number | null;
  nzDisabled?: boolean;
  nzHide?: boolean;
  nzCustomContent?: boolean;
  groupLabel?: string | number | TemplateRef<TriSafeAny> | null;
  type?: string;
  key?: TriSafeAny;
}

export interface TriSelectOptionInterface {
  label: string | number | null | TemplateRef<TriSafeAny>;
  value: TriSafeAny | null;
  title?: string | number | null;
  disabled?: boolean;
  hide?: boolean;
  groupLabel?: string | number | TemplateRef<TriSafeAny> | null;
  key?: string | number;
}

export type TriSelectTopControlItemType = Partial<TriSelectItemInterface> & {
  contentTemplateOutlet: TemplateRef<TriSafeAny> | null;
  contentTemplateOutletContext: TriSafeAny;
};

export type TriFilterOptionType = (input: string, option: TriSelectItemInterface) => boolean;

export type TriSelectPlacementType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
