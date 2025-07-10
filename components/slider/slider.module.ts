/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriSliderHandleComponent } from './handle.component';
import { TriSliderMarksComponent } from './marks.component';
import { TriSliderComponent } from './slider.component';
import { TriSliderStepComponent } from './step.component';
import { TriSliderTrackComponent } from './track.component';

@NgModule({
  imports: [
    TriSliderComponent,
    TriSliderTrackComponent,
    TriSliderHandleComponent,
    TriSliderStepComponent,
    TriSliderMarksComponent
  ],
  exports: [
    TriSliderComponent,
    TriSliderTrackComponent,
    TriSliderHandleComponent,
    TriSliderStepComponent,
    TriSliderMarksComponent
  ]
})
export class TriSliderModule {}
