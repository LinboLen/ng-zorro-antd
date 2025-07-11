/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component } from '@angular/core';

@Component({
  selector: 'tri-breadcrumb-separator',
  exportAs: 'triBreadcrumbSeparator',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-breadcrumb-separator'
  }
})
export class TriBreadCrumbSeparatorComponent {}
