/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriCronExpressionInputComponent } from './cron-expression-input.component';
import { TriCronExpressionLabelComponent } from './cron-expression-label.component';
import { TriCronExpressionPreviewComponent } from './cron-expression-preview.component';
import { TriCronExpressionComponent } from './cron-expression.component';

@NgModule({
  imports: [
    TriCronExpressionComponent,
    TriCronExpressionLabelComponent,
    TriCronExpressionInputComponent,
    TriCronExpressionPreviewComponent
  ],
  exports: [TriCronExpressionComponent]
})
export class TriCronExpressionModule {}
