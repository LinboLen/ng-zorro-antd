/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

export interface TriItemProps {
  description: string;
  checked?: boolean;
  onClick?: (item: TriItemProps) => void;
  key?: string;
}
