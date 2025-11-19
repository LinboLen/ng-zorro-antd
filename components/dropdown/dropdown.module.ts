/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriMenuModule } from 'ng-zorro-antd/menu';

import { TriContextMenuServiceModule } from './context-menu.service.module';
import { TriDropdownADirective } from './dropdown-a.directive';
import { TriDropdownMenuComponent } from './dropdown-menu.component';
import { TriDropdownDirective } from './dropdown.directive';

@NgModule({
  imports: [TriDropdownDirective, TriDropdownADirective, TriDropdownMenuComponent, TriContextMenuServiceModule],
  exports: [TriMenuModule, TriDropdownDirective, TriDropdownADirective, TriDropdownMenuComponent]
})
export class TriDropdownModule {}

/**
 * @deprecated Use {@link TriDropdownModule} instead.
 * This will be removed in v22.0.0.
 */
export const TriDropDownModule = TriDropdownModule;
