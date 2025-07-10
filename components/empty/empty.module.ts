/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriEmbedEmptyComponent } from './embed-empty.component';
import { TriEmptyComponent } from './empty.component';
import { TriEmptyDefaultComponent } from './partial/default';
import { TriEmptySimpleComponent } from './partial/simple';

@NgModule({
  imports: [TriEmptyComponent, TriEmbedEmptyComponent, TriEmptyDefaultComponent, TriEmptySimpleComponent],
  exports: [TriEmptyComponent, TriEmbedEmptyComponent]
})
export class TriEmptyModule {}
