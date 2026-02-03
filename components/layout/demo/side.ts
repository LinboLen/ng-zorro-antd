import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriLayoutModule } from 'ng-zorro-antd/layout';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-layout-side',
  imports: [TriBreadCrumbModule, TriIconModule, TriMenuModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider collapsible width="200px">
        <div class="logo"></div>
        <ul tri-menu theme="dark" mode="inline">
          <li tri-menu-item>
            <tri-icon type="pie-chart" />
            <span>Option 1</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="desktop" />
            <span>Option 2</span>
          </li>
          <li tri-submenu title="User" icon="user">
            <ul>
              <li tri-menu-item>Tom</li>
              <li tri-menu-item>Bill</li>
              <li tri-menu-item>Alex</li>
            </ul>
          </li>
          <li tri-submenu title="Team" icon="team">
            <ul>
              <li tri-menu-item>Team 1</li>
              <li tri-menu-item>Team 2</li>
            </ul>
          </li>
          <li tri-menu-item>
            <tri-icon type="file" />
            <span>File</span>
          </li>
        </ul>
      </tri-sider>
      <tri-layout>
        <tri-header />
        <tri-content>
          <tri-breadcrumb>
            <tri-breadcrumb-item>User</tri-breadcrumb-item>
            <tri-breadcrumb-item>Bill</tri-breadcrumb-item>
          </tri-breadcrumb>
          <div class="inner-content">Bill is a cat.</div>
        </tri-content>
        <tri-footer>Ant Design ©{{ date.getFullYear() }} Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: `
    .logo {
      height: 32px;
      margin: 16px;
      background: rgba(255, 255, 255, 0.3);
    }

    nz-header {
      background: #fff;
      padding: 0;
    }

    nz-content {
      margin: 0 16px;
    }

    nz-breadcrumb {
      margin: 16px 0;
    }

    .inner-content {
      padding: 24px;
      background: #fff;
      min-height: 360px;
      border-radius: 8px;
    }

    nz-footer {
      text-align: center;
    }

    :host > nz-layout {
      min-height: 100vh;
    }
  `
})
export class TriDemoLayoutSideComponent {
  protected readonly date = new Date();
}
