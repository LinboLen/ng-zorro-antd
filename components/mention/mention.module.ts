/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriMentionSuggestionDirective } from './mention-suggestions';
import { TriMentionTriggerDirective } from './mention-trigger';
import { TriMentionComponent } from './mention.component';

const COMPONENTS = [TriMentionComponent, TriMentionTriggerDirective, TriMentionSuggestionDirective];

@NgModule({
  imports: [...COMPONENTS],
  exports: [...COMPONENTS]
})
export class TriMentionModule {}
