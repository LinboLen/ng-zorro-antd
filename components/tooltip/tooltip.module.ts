/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTooltipComponent, TriTooltipDirective } from './tooltip';

@NgModule({
  imports: [TriTooltipComponent, TriTooltipDirective],
  exports: [TriTooltipComponent, TriTooltipDirective]
})
export class TriTooltipModule {}

/**
 * @deprecated Use {@link TriTooltipModule} instead.
 * This will be removed in v21.0.0.
 */
export const TriToolTipModule = TriTooltipModule;
