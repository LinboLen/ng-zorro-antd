/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriBreadCrumbItemComponent } from './breadcrumb-item.component';
import { TriBreadCrumbSeparatorComponent } from './breadcrumb-separator.component';
import { TriBreadCrumbComponent } from './breadcrumb.component';

@NgModule({
  imports: [TriBreadCrumbComponent, TriBreadCrumbItemComponent, TriBreadCrumbSeparatorComponent],
  exports: [TriBreadCrumbComponent, TriBreadCrumbItemComponent, TriBreadCrumbSeparatorComponent]
})
export class TriBreadCrumbModule {}
