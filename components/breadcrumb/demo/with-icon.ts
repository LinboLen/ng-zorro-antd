import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-breadcrumb-with-icon',
  imports: [TriBreadCrumbModule, TriIconModule],
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>
        <tri-icon type="home" />
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a>
          <tri-icon type="user" />
          <span>Application List</span>
        </a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>Application</tri-breadcrumb-item>
    </tri-breadcrumb>
  `
})
export class TriDemoBreadcrumbWithIconComponent {}
