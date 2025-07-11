import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: 'tri-demo-page-header-breadcrumb',
  imports: [TriBreadCrumbModule, TriPageHeaderModule],
  template: `
    <tri-page-header title="Title" subtitle="This is a subtitle">
      <tri-breadcrumb tri-page-header-breadcrumb>
        <tri-breadcrumb-item>First-level Menu</tri-breadcrumb-item>
        <tri-breadcrumb-item>
          <a>Second-level Menu</a>
        </tri-breadcrumb-item>
        <tri-breadcrumb-item>Third-level Menu</tri-breadcrumb-item>
      </tri-breadcrumb>
    </tri-page-header>
  `
})
export class TriDemoPageHeaderBreadcrumbComponent {}
