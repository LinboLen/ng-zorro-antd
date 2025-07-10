/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriResultNotFoundComponent } from './partial/not-found';
import { TriResultServerErrorComponent } from './partial/server-error.component';
import { TriResultUnauthorizedComponent } from './partial/unauthorized';
import {
  TriResultContentDirective,
  TriResultExtraDirective,
  TriResultIconDirective,
  TriResultSubtitleDirective,
  TriResultTitleDirective
} from './result-cells';
import { TriResultComponent } from './result.component';

const partial = [TriResultNotFoundComponent, TriResultServerErrorComponent, TriResultUnauthorizedComponent];

const cellDirectives = [
  TriResultContentDirective,
  TriResultExtraDirective,
  TriResultIconDirective,
  TriResultSubtitleDirective,
  TriResultTitleDirective
];

@NgModule({
  imports: [TriResultComponent, ...cellDirectives, ...partial],
  exports: [TriResultComponent, ...cellDirectives]
})
export class TriResultModule {}
