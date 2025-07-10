import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriLayoutModule } from 'ng-zorro-antd/layout';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: '',
  imports: [TriBreadCrumbModule, TriIconModule, TriMenuModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-header>
        <div class="logo"></div>
        <ul tri-menu theme="dark" mode="horizontal">
          <li tri-menu-item>nav 1</li>
          <li tri-menu-item>nav 2</li>
          <li tri-menu-item>nav 3</li>
        </ul>
      </tri-header>
      <tri-content>
        <tri-breadcrumb>
          <tri-breadcrumb-item>Home</tri-breadcrumb-item>
          <tri-breadcrumb-item>List</tri-breadcrumb-item>
          <tri-breadcrumb-item>App</tri-breadcrumb-item>
        </tri-breadcrumb>
        <div class="inner-content">Content</div>
      </tri-content>
      <tri-footer>Ant Design ©2020 Implement By Angular</tri-footer>
    </tri-layout>
  `,
  styles: [
    `
      .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 24px 16px 0;
        float: left;
      }

      [nz-menu] {
        line-height: 64px;
      }

      nz-breadcrumb {
        margin: 16px 0;
      }

      nz-content {
        padding: 0 50px;
      }

      nz-footer {
        text-align: center;
      }

      .inner-content {
        background: #fff;
        padding: 24px;
        min-height: 280px;
      }
    `
  ]
})
export class TriDemoLayoutTopComponent {}
