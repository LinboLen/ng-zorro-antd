/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriI18nPipe } from './nz-i18n.pipe';

@NgModule({
  imports: [TriI18nPipe],
  exports: [TriI18nPipe]
})
export class TriI18nModule {}
