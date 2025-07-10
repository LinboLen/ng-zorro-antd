/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriAutocompleteOptgroupComponent } from './autocomplete-optgroup.component';
import { TriAutocompleteOptionComponent } from './autocomplete-option.component';
import { TriAutocompleteTriggerDirective } from './autocomplete-trigger.directive';
import { TriAutocompleteComponent } from './autocomplete.component';

@NgModule({
  exports: [
    TriAutocompleteComponent,
    TriAutocompleteOptionComponent,
    TriAutocompleteTriggerDirective,
    TriAutocompleteOptgroupComponent
  ],
  imports: [
    TriAutocompleteComponent,
    TriAutocompleteOptionComponent,
    TriAutocompleteTriggerDirective,
    TriAutocompleteOptgroupComponent
  ]
})
export class TriAutocompleteModule {}
