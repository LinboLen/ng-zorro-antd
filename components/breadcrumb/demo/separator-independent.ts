import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'tri-demo-breadcrumb-separator-independent',
  imports: [TriBreadCrumbModule],
  template: `
    <tri-breadcrumb [separator]="null">
      <tri-breadcrumb-item>Location</tri-breadcrumb-item>
      <tri-breadcrumb-separator>:</tri-breadcrumb-separator>
      <tri-breadcrumb-item>
        <a>Application Center</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-separator>/</tri-breadcrumb-separator>
      <tri-breadcrumb-item>Application List</tri-breadcrumb-item>
      <tri-breadcrumb-separator>/</tri-breadcrumb-separator>
      <tri-breadcrumb-item>An Application</tri-breadcrumb-item>
    </tri-breadcrumb>
  `
})
export class TriDemoBreadcrumbSeparatorIndependentComponent {}
