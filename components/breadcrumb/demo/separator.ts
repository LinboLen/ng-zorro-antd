import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-breadcrumb-separator',
  imports: [TriBreadCrumbModule, TriIconModule],
  template: `
    <h4>String</h4>
    <tri-breadcrumb separator=">">
      <tri-breadcrumb-item>Home</tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a>Application List</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>An Application</tri-breadcrumb-item>
    </tri-breadcrumb>
    <br />
    <h4>TemplateRef</h4>
    <tri-breadcrumb [separator]="iconTemplate">
      <tri-breadcrumb-item>Home</tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a>Application List</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>An Application</tri-breadcrumb-item>
    </tri-breadcrumb>
    <ng-template #iconTemplate><tri-icon type="arrow-right" /></ng-template>
  `,
  styles: `
    h4:first-child {
      margin-top: 0;
    }

    h4 {
      margin: 16px 0;
      font-size: 14px;
      line-height: 1;
      font-weight: normal;
    }
  `
})
export class TriDemoBreadcrumbSeparatorComponent {}
