/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import {
  TriInputAddonAfterDirective,
  TriInputAddonBeforeDirective,
  TriInputPrefixDirective,
  TriInputSuffixDirective
} from 'ng-zorro-antd/input';

import { TriInputNumberComponent } from './input-number.component';

@NgModule({
  imports: [
    TriInputNumberComponent,
    TriInputAddonBeforeDirective,
    TriInputAddonAfterDirective,
    TriInputPrefixDirective,
    TriInputSuffixDirective
  ],
  exports: [
    TriInputNumberComponent,
    TriInputAddonBeforeDirective,
    TriInputAddonAfterDirective,
    TriInputPrefixDirective,
    TriInputSuffixDirective
  ]
})
export class TriInputNumberModule {}
