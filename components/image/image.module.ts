/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriImageGroupComponent } from './image-group.component';
import { TriImagePreviewComponent } from './image-preview.component';
import { TriImageDirective } from './image.directive';
import { TriImageService } from './image.service';

@NgModule({
  imports: [TriImageDirective, TriImagePreviewComponent, TriImageGroupComponent],
  exports: [TriImageDirective, TriImagePreviewComponent, TriImageGroupComponent],
  providers: [TriImageService]
})
export class TriImageModule {}
