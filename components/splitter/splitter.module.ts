/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriSplitterPanelComponent } from './splitter-panel.component';
import { TriSplitterComponent } from './splitter.component';

@NgModule({
  imports: [TriSplitterComponent, TriSplitterPanelComponent],
  exports: [TriSplitterComponent, TriSplitterPanelComponent]
})
export class TriSplitterModule {}
