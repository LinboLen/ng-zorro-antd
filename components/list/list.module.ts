/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import {
  TriListEmptyComponent,
  TriListFooterComponent,
  TriListGridDirective,
  TriListHeaderComponent,
  TriListLoadMoreDirective,
  TriListPaginationComponent
} from './list-cell';
import { TriListItemActionComponent, TriListItemActionsComponent, TriListItemExtraComponent } from './list-item-cell';
import {
  TriListItemMetaAvatarComponent,
  TriListItemMetaDescriptionComponent,
  TriListItemMetaTitleComponent
} from './list-item-meta-cell';
import { TriListItemMetaComponent } from './list-item-meta.component';
import { TriListItemComponent } from './list-item.component';
import { TriListComponent } from './list.component';

const DIRECTIVES = [
  TriListComponent,
  TriListHeaderComponent,
  TriListFooterComponent,
  TriListPaginationComponent,
  TriListEmptyComponent,
  TriListItemComponent,
  TriListItemMetaComponent,
  TriListItemMetaTitleComponent,
  TriListItemMetaDescriptionComponent,
  TriListItemMetaAvatarComponent,
  TriListItemActionsComponent,
  TriListItemActionComponent,
  TriListItemExtraComponent,
  TriListLoadMoreDirective,
  TriListGridDirective
];

@NgModule({
  imports: [DIRECTIVES],
  exports: [DIRECTIVES]
})
export class TriListModule {}
