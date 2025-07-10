/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriTabAddButtonComponent } from './tab-add-button.component';
import { TriTabBarExtraContentDirective } from './tab-bar-extra-content.directive';
import { TriTabBodyComponent } from './tab-body.component';
import { TriTabCloseButtonComponent } from './tab-close-button.component';
import { TriTabLinkDirective, TriTabLinkTemplateDirective } from './tab-link.directive';
import { TriTabNavBarComponent } from './tab-nav-bar.component';
import { TriTabNavItemDirective } from './tab-nav-item.directive';
import { TriTabNavOperationComponent } from './tab-nav-operation.component';
import { TriTabScrollListDirective } from './tab-scroll-list.directive';
import { TriTabComponent } from './tab.component';
import { TriTabDirective } from './tab.directive';
import { TriTabsInkBarDirective } from './tabs-ink-bar.directive';
import { TriTabsComponent } from './tabs.component';

const DIRECTIVES = [
  TriTabsComponent,
  TriTabComponent,
  TriTabNavBarComponent,
  TriTabNavItemDirective,
  TriTabsInkBarDirective,
  TriTabScrollListDirective,
  TriTabNavOperationComponent,
  TriTabAddButtonComponent,
  TriTabCloseButtonComponent,
  TriTabDirective,
  TriTabBodyComponent,
  TriTabLinkDirective,
  TriTabLinkTemplateDirective,
  TriTabBarExtraContentDirective
];

@NgModule({
  imports: [DIRECTIVES],
  exports: [DIRECTIVES]
})
export class TriTabsModule {}
