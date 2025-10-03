/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriAutosizeDirective } from './autosize.directive';
import { TriInputAddonAfterDirective, TriInputAddonBeforeDirective } from './input-addon.directive';
import { TriInputPrefixDirective, TriInputSuffixDirective } from './input-affix.directive';
import { TriInputGroupSlotComponent } from './input-group-slot.component';
import { TriInputGroupComponent, TriInputGroupWhitSuffixOrPrefixDirective } from './input-group.component';
import { TriInputOtpComponent } from './input-otp.component';
import { TriInputWrapperComponent } from './input-wrapper.component';
import { TriInputDirective } from './input.directive';
import { TriTextareaCountComponent } from './textarea-count.component';

@NgModule({
  imports: [
    TriTextareaCountComponent,
    TriInputDirective,
    TriInputWrapperComponent,
    TriInputAddonBeforeDirective,
    TriInputAddonAfterDirective,
    TriInputPrefixDirective,
    TriInputSuffixDirective,
    TriInputGroupComponent,
    TriAutosizeDirective,
    TriInputGroupSlotComponent,
    TriInputGroupWhitSuffixOrPrefixDirective,
    TriInputOtpComponent
  ],
  exports: [
    TriTextareaCountComponent,
    TriInputDirective,
    TriInputWrapperComponent,
    TriInputAddonBeforeDirective,
    TriInputAddonAfterDirective,
    TriInputPrefixDirective,
    TriInputSuffixDirective,
    TriInputGroupComponent,
    TriAutosizeDirective,
    TriInputGroupWhitSuffixOrPrefixDirective,
    TriInputOtpComponent
  ]
})
export class TriInputModule {}
