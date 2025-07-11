import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'tri-demo-breadcrumb-basic',
  imports: [TriBreadCrumbModule],
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>Home</tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a>Application List</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>An Application</tri-breadcrumb-item>
    </tri-breadcrumb>
  `
})
export class TriDemoBreadcrumbBasicComponent {}
