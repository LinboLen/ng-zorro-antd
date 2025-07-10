/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriPaginationDefaultComponent } from './pagination-default.component';
import { TriPaginationItemComponent } from './pagination-item.component';
import { TriPaginationOptionsComponent } from './pagination-options.component';
import { TriPaginationSimpleComponent } from './pagination-simple.component';
import { TriPaginationComponent } from './pagination.component';

@NgModule({
  imports: [
    TriPaginationComponent,
    TriPaginationSimpleComponent,
    TriPaginationOptionsComponent,
    TriPaginationItemComponent,
    TriPaginationDefaultComponent
  ],
  exports: [TriPaginationComponent]
})
export class TriPaginationModule {}
