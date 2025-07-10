/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriMenuModule } from 'ng-zorro-antd/menu';

import { TriContextMenuServiceModule } from './context-menu.service.module';
import { TriDropDownADirective } from './dropdown-a.directive';
import { TriDropdownButtonDirective } from './dropdown-button.directive';
import { TriDropdownMenuComponent } from './dropdown-menu.component';
import { TriDropDownDirective } from './dropdown.directive';

@NgModule({
  imports: [
    TriDropDownDirective,
    TriDropDownADirective,
    TriDropdownMenuComponent,
    TriDropdownButtonDirective,
    TriContextMenuServiceModule
  ],
  exports: [TriMenuModule, TriDropDownDirective, TriDropDownADirective, TriDropdownMenuComponent, TriDropdownButtonDirective]
})
export class TriDropDownModule {}
