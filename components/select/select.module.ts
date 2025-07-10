/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriOptionContainerComponent } from './option-container.component';
import { TriOptionGroupComponent } from './option-group.component';
import { TriOptionItemGroupComponent } from './option-item-group.component';
import { TriOptionItemComponent } from './option-item.component';
import { TriOptionComponent } from './option.component';
import { TriSelectArrowComponent } from './select-arrow.component';
import { TriSelectClearComponent } from './select-clear.component';
import { TriSelectItemComponent } from './select-item.component';
import { TriSelectPlaceholderComponent } from './select-placeholder.component';
import { TriSelectSearchComponent } from './select-search.component';
import { TriSelectTopControlComponent } from './select-top-control.component';
import { TriSelectComponent } from './select.component';

@NgModule({
  imports: [
    TriOptionComponent,
    TriSelectComponent,
    TriOptionContainerComponent,
    TriOptionGroupComponent,
    TriOptionItemComponent,
    TriSelectTopControlComponent,
    TriSelectSearchComponent,
    TriSelectItemComponent,
    TriSelectClearComponent,
    TriSelectArrowComponent,
    TriSelectPlaceholderComponent,
    TriOptionItemGroupComponent
  ],
  exports: [
    TriOptionComponent,
    TriSelectComponent,
    TriOptionGroupComponent,
    TriSelectArrowComponent,
    TriSelectClearComponent,
    TriSelectItemComponent,
    TriSelectPlaceholderComponent,
    TriSelectSearchComponent
  ]
})
export class TriSelectModule {}
