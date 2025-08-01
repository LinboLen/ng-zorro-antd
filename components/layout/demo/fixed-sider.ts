import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriLayoutModule } from 'ng-zorro-antd/layout';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-layout-fixed-sider',
  imports: [TriIconModule, TriMenuModule, TriLayoutModule],
  template: `
    <tri-layout class="layout">
      <tri-sider>
        <div class="logo"></div>
        <ul tri-menu theme="dark" mode="inline">
          <li tri-menu-item>
            <tri-icon type="file" />
            <span>nav 1</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="video-camera" />
            <span>nav 2</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="upload" />
            <span>nav 3</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="bar-chart" />
            <span>nav 4</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="cloud-o" />
            <span>nav 5</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="appstore-o" />
            <span>nav 6</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="team" />
            <span>nav 7</span>
          </li>
          <li tri-menu-item>
            <tri-icon type="shop" />
            <span>nav 8</span>
          </li>
        </ul>
      </tri-sider>
      <tri-layout class="right-layout">
        <tri-header></tri-header>
        <tri-content>
          <div class="inner-content">
            ...
            <br />
            Really
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            long
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            ...
            <br />
            content
          </div>
        </tri-content>
        <tri-footer>Ant Design ©{{ date.getFullYear() }} Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: [
    `
      .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
      }

      .layout {
        min-height: 100vh;
      }

      nz-sider {
        overflow: auto;
        height: 100%;
        position: fixed;
        left: 0;
      }

      .right-layout {
        margin-left: 200px;
      }

      nz-header {
        background: #fff;
        padding: 0;
      }

      nz-content {
        margin: 24px 16px 0;
        overflow: initial;
      }

      .inner-content {
        padding: 24px;
        background: #fff;
        text-align: center;
      }

      nz-footer {
        text-align: center;
      }
    `
  ]
})
export class TriDemoLayoutFixedSiderComponent {
  protected readonly date = new Date();
}
