import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'tri-demo-breadcrumb-auto',
  imports: [TriBreadCrumbModule],
  template: `
    <tri-breadcrumb [autoGenerate]="true">
      Please refer to StackBlitz demo at https://stackblitz.com/edit/ng-zorro-breadcrumb-auto
    </tri-breadcrumb>
  `
})
export class TriDemoBreadcrumbAutoComponent {}
