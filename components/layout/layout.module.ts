/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriContentComponent } from './content.component';
import { TriFooterComponent } from './footer.component';
import { TriHeaderComponent } from './header.component';
import { TriLayoutComponent } from './layout.component';
import { TriSiderTriggerComponent } from './sider-trigger.component';
import { TriSiderComponent } from './sider.component';

@NgModule({
  imports: [
    TriLayoutComponent,
    TriHeaderComponent,
    TriContentComponent,
    TriFooterComponent,
    TriSiderComponent,
    TriSiderTriggerComponent
  ],
  exports: [TriLayoutComponent, TriHeaderComponent, TriContentComponent, TriFooterComponent, TriSiderComponent]
})
export class TriLayoutModule {}
