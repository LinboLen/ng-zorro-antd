/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriAvatarGroupComponent } from './avatar-group.component';
import { TriAvatarComponent } from './avatar.component';

@NgModule({
  exports: [TriAvatarComponent, TriAvatarGroupComponent],
  imports: [TriAvatarComponent, TriAvatarGroupComponent]
})
export class TriAvatarModule {}
