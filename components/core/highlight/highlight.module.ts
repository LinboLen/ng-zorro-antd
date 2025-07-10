/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriHighlightPipe } from './highlight.pipe';

/**
 * @deprecated Will be removed in v21, use `NzHighlightPipe` directly instead.
 */
@NgModule({
  imports: [TriHighlightPipe],
  exports: [TriHighlightPipe]
})
export class TriHighlightModule {}
