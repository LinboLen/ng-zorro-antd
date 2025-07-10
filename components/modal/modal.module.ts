/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriModalCloseComponent } from './modal-close.component';
import { TriModalConfirmContainerComponent } from './modal-confirm-container.component';
import { TriModalContainerComponent } from './modal-container.component';
import { TriModalContentDirective } from './modal-content.directive';
import { TriModalFooterComponent } from './modal-footer.component';
import { TriModalFooterDirective } from './modal-footer.directive';
import { TriModalTitleComponent } from './modal-title.component';
import { TriModalTitleDirective } from './modal-title.directive';
import { TriModalComponent } from './modal.component';
import { TriModalService } from './modal.service';

@NgModule({
  imports: [
    TriModalComponent,
    TriModalFooterDirective,
    TriModalContentDirective,
    TriModalCloseComponent,
    TriModalFooterComponent,
    TriModalTitleComponent,
    TriModalTitleDirective,
    TriModalContainerComponent,
    TriModalConfirmContainerComponent
  ],
  exports: [TriModalComponent, TriModalFooterDirective, TriModalContentDirective, TriModalTitleDirective],
  providers: [TriModalService]
})
export class TriModalModule {}
