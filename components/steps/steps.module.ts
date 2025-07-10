/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriStepComponent } from './step.component';
import { TriStepsComponent } from './steps.component';

@NgModule({
  imports: [TriStepsComponent, TriStepComponent],
  exports: [TriStepsComponent, TriStepComponent]
})
export class TriStepsModule {}
