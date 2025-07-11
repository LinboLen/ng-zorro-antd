import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'tri-demo-breadcrumb-router',
  imports: [RouterLink, TriBreadCrumbModule],
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>
        <a [routerLink]="['../../']">Home</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>Breadcrumb</tri-breadcrumb-item>
    </tri-breadcrumb>
  `
})
export class TriDemoBreadcrumbRouterComponent {}
