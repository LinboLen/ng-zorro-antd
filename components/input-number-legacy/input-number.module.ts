/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriInputNumberGroupSlotComponent } from './input-number-group-slot.component';
import {
  TriInputNumberGroupComponent,
  TriInputNumberGroupWhitSuffixOrPrefixDirective
} from './input-number-group.component';
import { TriInputNumberLegacyComponent } from './input-number.component';

/**
 * @deprecated Will be removed in v21. It is recommended to use the new version `<nz-input-number>`.
 */
@NgModule({
  imports: [
    TriInputNumberLegacyComponent,
    TriInputNumberGroupComponent,
    TriInputNumberGroupWhitSuffixOrPrefixDirective,
    TriInputNumberGroupSlotComponent
  ],
  exports: [TriInputNumberLegacyComponent, TriInputNumberGroupComponent, TriInputNumberGroupWhitSuffixOrPrefixDirective]
})
export class TriInputNumberLegacyModule {}
