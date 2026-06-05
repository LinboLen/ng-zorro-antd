/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriInputAddonAfterDirective, TriInputAddonBeforeDirective } from './input-addon.directive';
import { TriInputPrefixDirective, TriInputSuffixDirective } from './input-affix.directive';
import { TriInputOtpComponent } from './input-otp.component';
import { TriInputPasswordDirective, TriInputPasswordIconDirective } from './input-password.directive';
import { TriInputSearchDirective, TriInputSearchEnterButtonDirective } from './input-search.directive';
import { TriInputWrapperComponent } from './input-wrapper.component';
import { TriInputDirective } from './input.directive';
import { TriTextareaCountComponent } from './textarea-count.component';

@NgModule({
  imports: [
    TriTextareaCountComponent,
    TriInputDirective,
    TriInputWrapperComponent,
    TriInputPasswordDirective,
    TriInputPasswordIconDirective,
    TriInputSearchDirective,
    TriInputSearchEnterButtonDirective,
    TriInputAddonBeforeDirective,
    TriInputAddonAfterDirective,
    TriInputPrefixDirective,
    TriInputSuffixDirective,
    TriInputOtpComponent
  ],
  exports: [
    TriTextareaCountComponent,
    TriInputDirective,
    TriInputWrapperComponent,
    TriInputPasswordDirective,
    TriInputPasswordIconDirective,
    TriInputSearchDirective,
    TriInputSearchEnterButtonDirective,
    TriInputAddonBeforeDirective,
    TriInputAddonAfterDirective,
    TriInputPrefixDirective,
    TriInputSuffixDirective,
    TriInputOtpComponent
  ]
})
export class TriInputModule {}
