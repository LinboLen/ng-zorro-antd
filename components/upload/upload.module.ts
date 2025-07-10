/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriUploadBtnComponent } from './upload-btn.component';
import { TriUploadListComponent } from './upload-list.component';
import { TriUploadComponent } from './upload.component';

@NgModule({
  imports: [TriUploadComponent, TriUploadBtnComponent, TriUploadListComponent],
  exports: [TriUploadComponent]
})
export class TriUploadModule {}
