/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriOverflowContainerComponent } from './overflow-container.component';
import { TriOverflowItemDirective } from './overflow-item.directive';
import { TriOverflowRestDirective } from './overflow-rest.directive';
import { TriOverflowSuffixDirective } from './overflow-suffix.directive';

@NgModule({
  imports: [TriOverflowContainerComponent, TriOverflowItemDirective, TriOverflowRestDirective, TriOverflowSuffixDirective],
  exports: [TriOverflowContainerComponent, TriOverflowItemDirective, TriOverflowRestDirective, TriOverflowSuffixDirective]
})
export class TriOverflowModule {}
