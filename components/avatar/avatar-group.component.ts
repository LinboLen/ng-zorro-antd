/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tri-avatar-group',
  exportAs: 'triAvatarGroup',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-avatar-group'
  }
})
export class TriAvatarGroupComponent {}
