/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriMenuDividerDirective } from './menu-divider.directive';
import { TriMenuGroupComponent } from './menu-group.component';
import { TriMenuItemComponent } from './menu-item.component';
import { TriMenuDirective } from './menu.directive';
import { TriSubmenuInlineChildComponent } from './submenu-inline-child.component';
import { TriSubmenuNoneInlineChildComponent } from './submenu-non-inline-child.component';
import { TriSubMenuTitleComponent } from './submenu-title.component';
import { TriSubMenuComponent } from './submenu.component';

@NgModule({
  imports: [
    TriMenuDirective,
    TriMenuItemComponent,
    TriSubMenuComponent,
    TriMenuDividerDirective,
    TriMenuGroupComponent,
    TriSubMenuTitleComponent,
    TriSubmenuInlineChildComponent,
    TriSubmenuNoneInlineChildComponent
  ],
  exports: [TriMenuDirective, TriMenuItemComponent, TriSubMenuComponent, TriMenuDividerDirective, TriMenuGroupComponent]
})
export class TriMenuModule {}
