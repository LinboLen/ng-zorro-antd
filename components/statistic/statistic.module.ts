/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriCountdownComponent } from './countdown.component';
import { TriStatisticNumberComponent } from './statistic-number.component';
import { TriStatisticComponent } from './statistic.component';

@NgModule({
  imports: [TriStatisticComponent, TriCountdownComponent, TriStatisticNumberComponent],
  exports: [TriStatisticComponent, TriCountdownComponent, TriStatisticNumberComponent]
})
export class TriStatisticModule {}
