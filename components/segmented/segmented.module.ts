/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriSegmentedItemComponent } from './segmented-item.component';
import { TriSegmentedComponent } from './segmented.component';

@NgModule({
  imports: [TriSegmentedComponent, TriSegmentedItemComponent],
  exports: [TriSegmentedComponent, TriSegmentedItemComponent]
})
export class TriSegmentedModule {}
