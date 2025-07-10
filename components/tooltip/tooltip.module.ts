/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

// NOTE: the `t` is not uppercase in directives. Change this would however introduce breaking change.
import { TriToolTipComponent, TriTooltipDirective } from './tooltip';

@NgModule({
  imports: [TriToolTipComponent, TriTooltipDirective],
  exports: [TriToolTipComponent, TriTooltipDirective]
})
export class TriToolTipModule {}
