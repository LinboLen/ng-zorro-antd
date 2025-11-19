import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriDropdownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'tri-demo-breadcrumb-dropdown',
  imports: [TriBreadCrumbModule, TriDropdownModule],
  template: `
    <tri-breadcrumb>
      <tri-breadcrumb-item>Ant Design</tri-breadcrumb-item>
      <tri-breadcrumb-item>
        <a>Component</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item [overlay]="menu">
        <a href>An Application</a>
      </tri-breadcrumb-item>
      <tri-breadcrumb-item>Button</tri-breadcrumb-item>
    </tri-breadcrumb>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu selectable>
        <li tri-menu-item>General</li>
        <li tri-menu-item>Layout</li>
        <li tri-menu-item>Navigation</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoBreadcrumbDropdownComponent {}
