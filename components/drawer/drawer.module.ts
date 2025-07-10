/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriDrawerContentDirective } from './drawer-content.directive';
import { TriDrawerComponent } from './drawer.component';
import { TriDrawerService } from './drawer.service';

@NgModule({
  imports: [TriDrawerComponent, TriDrawerContentDirective],
  providers: [TriDrawerService],
  exports: [TriDrawerComponent, TriDrawerContentDirective]
})
export class TriDrawerModule {}
