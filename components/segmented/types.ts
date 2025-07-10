/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export type TriSegmentedOption = {
  value: string | number;
  disabled?: boolean;
} & (TriSegmentedWithLabel | TriSegmentedWithIcon);

export interface TriSegmentedWithLabel {
  label: string;
  icon?: string;
}

export interface TriSegmentedWithIcon {
  icon: string;
  label?: string;
}

export type TriSegmentedOptions = Array<TriSegmentedOption | string | number>;

export function normalizeOptions(unnormalized: TriSegmentedOptions): TriSegmentedOption[] {
  return unnormalized.map(item => {
    if (typeof item === 'string' || typeof item === 'number') {
      return {
        label: `${item}`,
        value: item
      };
    }

    return item;
  });
}
