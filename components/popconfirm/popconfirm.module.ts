/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriPopconfirmComponent, TriPopconfirmDirective } from './popconfirm';

@NgModule({
  imports: [TriPopconfirmComponent, TriPopconfirmDirective],
  exports: [TriPopconfirmComponent, TriPopconfirmDirective]
})
export class TriPopconfirmModule {}
