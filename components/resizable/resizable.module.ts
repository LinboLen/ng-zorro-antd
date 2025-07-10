/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriResizableDirective } from './resizable.directive';
import { TriResizeHandleComponent } from './resize-handle.component';
import { TriResizeHandlesComponent } from './resize-handles.component';

@NgModule({
  imports: [TriResizableDirective, TriResizeHandleComponent, TriResizeHandlesComponent],
  exports: [TriResizableDirective, TriResizeHandleComponent, TriResizeHandlesComponent]
})
export class TriResizableModule {}
