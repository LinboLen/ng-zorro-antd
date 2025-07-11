import { Component } from '@angular/core';

import { TriBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriLayoutModule } from 'ng-zorro-antd/layout';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-layout-custom-trigger',
  imports: [TriBreadCrumbModule, TriIconModule, TriMenuModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider collapsible [(collapsedChange)]="isCollapsed" [trigger]="null">
        <div class="logo"></div>
        <ul tri-menu theme="dark" mode="inline">
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
        <tri-header>
          <tri-icon
            class="trigger"
            [type]="isCollapsed ? 'menu-unfold' : 'menu-fold'"
            (click)="isCollapsed = !isCollapsed"
          />
        </tri-header>
        <tri-content>
          <tri-breadcrumb>
            <tri-breadcrumb-item>User</tri-breadcrumb-item>
            <tri-breadcrumb-item>Bill</tri-breadcrumb-item>
          </tri-breadcrumb>
          <div class="inner-content">Bill is a cat.</div>
        </tri-content>
        <tri-footer>Ant Design ©2020 Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: [
    `
      .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;
      }

      .trigger:hover {
        color: #1890ff;
      }

      .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
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
      }

      nz-footer {
        text-align: center;
      }
    `
  ]
})
export class TriDemoLayoutCustomTriggerComponent {
  isCollapsed = false;
}
