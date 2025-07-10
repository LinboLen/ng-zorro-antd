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
        <ul tri-menu theme="dark" mode="horizontal" class="header-menu">
          <li tri-menu-item>nav 1</li>
          <li tri-menu-item selected>nav 2</li>
          <li tri-menu-item>nav 3</li>
        </ul>
      </tri-header>
      <tri-content class="outer-content">
        <tri-breadcrumb>
          <tri-breadcrumb-item>Home</tri-breadcrumb-item>
          <tri-breadcrumb-item>List</tri-breadcrumb-item>
          <tri-breadcrumb-item>App</tri-breadcrumb-item>
        </tri-breadcrumb>
        <tri-layout class="inner-layout">
          <tri-sider width="200px" theme="light">
            <ul tri-menu mode="inline" class="sider-menu">
              <li tri-submenu open title="subnav 1" icon="user">
                <ul>
                  <li tri-menu-item selected>option1</li>
                  <li tri-menu-item>option2</li>
                  <li tri-menu-item>option3</li>
                  <li tri-menu-item>option4</li>
                </ul>
              </li>
              <li tri-submenu title="subnav 2" icon="laptop">
                <ul>
                  <li tri-menu-item>option5</li>
                  <li tri-menu-item>option6</li>
                  <li tri-menu-item>option7</li>
                  <li tri-menu-item>option8</li>
                </ul>
              </li>
              <li tri-submenu title="subnav 3" icon="notification">
                <ul>
                  <li tri-menu-item>option9</li>
                  <li tri-menu-item>option10</li>
                  <li tri-menu-item>option11</li>
                  <li tri-menu-item>option12</li>
                </ul>
              </li>
            </ul>
          </tri-sider>
          <tri-content class="inner-content">Content</tri-content>
        </tri-layout>
        <tri-footer>Ant Design ©2020 Implement By Angular</tri-footer>
      </tri-content>
    </tri-layout>
  `,
  styles: [
    `
      .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 28px 16px 0;
        float: left;
      }

      .header-menu {
        line-height: 64px;
      }

      .outer-content {
        padding: 0 50px;
      }

      nz-breadcrumb {
        margin: 16px 0;
      }

      .inner-layout {
        padding: 24px 0;
        background: #fff;
      }

      .sider-menu {
        height: 100%;
      }

      .inner-content {
        padding: 0 24px;
        min-height: 280px;
      }

      nz-footer {
        text-align: center;
      }
    `
  ]
})
export class TriDemoLayoutTopSideComponent {}
