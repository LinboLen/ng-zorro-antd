/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import {
  TriCommentActionComponent,
  TriCommentActionHostDirective,
  TriCommentAvatarDirective,
  TriCommentContentDirective
} from './comment-cells';
import { TriCommentComponent } from './comment.component';

const TRI_COMMENT_CELLS = [
  TriCommentAvatarDirective,
  TriCommentContentDirective,
  TriCommentActionComponent,
  TriCommentActionHostDirective
];

@NgModule({
  imports: [TriCommentComponent, ...TRI_COMMENT_CELLS],
  exports: [TriCommentComponent, ...TRI_COMMENT_CELLS]
})
export class TriCommentModule {}
