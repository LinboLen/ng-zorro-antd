/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriCountdownComponent } from './countdown.component';
import { TriStatisticContentValueComponent } from './statistic-content-value.component';
import { TriStatisticComponent } from './statistic.component';

@NgModule({
  imports: [TriStatisticComponent, TriCountdownComponent, TriStatisticContentValueComponent],
  exports: [TriStatisticComponent, TriCountdownComponent, TriStatisticContentValueComponent]
})
export class TriStatisticModule {}
