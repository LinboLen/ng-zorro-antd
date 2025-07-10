/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriAnchorLinkComponent } from './anchor-link.component';
import { TriAnchorComponent } from './anchor.component';

@NgModule({
  exports: [TriAnchorComponent, TriAnchorLinkComponent],
  imports: [TriAnchorComponent, TriAnchorLinkComponent]
})
export class TriAnchorModule {}
