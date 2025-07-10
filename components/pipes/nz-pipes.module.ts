/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriAggregatePipe } from './nz-aggregate.pipe';
import { TriBytesPipe } from './nz-bytes.pipe';
import { TriToCssUnitPipe } from './nz-css-unit.pipe';
import { TriEllipsisPipe } from './nz-ellipsis.pipe';
import { TriSanitizerPipe } from './nz-sanitizer.pipe';
import { TriTrimPipe } from './nz-trim.pipe';

const pipes = [TriToCssUnitPipe, TriSanitizerPipe, TriTrimPipe, TriBytesPipe, TriAggregatePipe, TriEllipsisPipe];

@NgModule({
  imports: [pipes],
  exports: [pipes]
})
export class TriPipesModule {}
