/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriGraphDefsComponent } from './graph-defs.component';
import { TriGraphEdgeComponent } from './graph-edge.component';
import { TriGraphEdgeDirective } from './graph-edge.directive';
import { TriGraphGroupNodeDirective } from './graph-group-node.directive';
import { TriGraphMinimapComponent } from './graph-minimap.component';
import { TriGraphNodeComponent } from './graph-node.component';
import { TriGraphNodeDirective } from './graph-node.directive';
import { TriGraphZoomDirective } from './graph-zoom.directive';
import { TriGraphComponent } from './graph.component';

@NgModule({
  imports: [
    TriGraphComponent,
    TriGraphMinimapComponent,
    TriGraphDefsComponent,
    TriGraphNodeDirective,
    TriGraphGroupNodeDirective,
    TriGraphZoomDirective,
    TriGraphNodeComponent,
    TriGraphEdgeComponent,
    TriGraphEdgeDirective
  ],
  exports: [
    TriGraphComponent,
    TriGraphMinimapComponent,
    TriGraphDefsComponent,
    TriGraphNodeDirective,
    TriGraphGroupNodeDirective,
    TriGraphZoomDirective,
    TriGraphNodeComponent,
    TriGraphEdgeComponent,
    TriGraphEdgeDirective
  ]
})
export class TriGraphModule {}
