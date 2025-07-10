/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTimelineItemComponent } from './timeline-item.component';
import { TriTimelineComponent } from './timeline.component';

@NgModule({
  imports: [TriTimelineItemComponent, TriTimelineComponent],
  exports: [TriTimelineItemComponent, TriTimelineComponent]
})
export class TriTimelineModule {}
