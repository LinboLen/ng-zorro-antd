/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { BidiModule } from '@angular/cdk/bidi';
import { NgModule } from '@angular/core';

import { TriCardGridDirective } from './card-grid.directive';
import { TriCardMetaComponent } from './card-meta.component';
import { TriCardTabComponent } from './card-tab.component';
import { TriCardComponent } from './card.component';

@NgModule({
  imports: [TriCardComponent, TriCardGridDirective, TriCardMetaComponent, TriCardTabComponent],
  exports: [BidiModule, TriCardComponent, TriCardGridDirective, TriCardMetaComponent, TriCardTabComponent]
})
export class TriCardModule {}
