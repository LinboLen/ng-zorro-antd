import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriLayoutModule } from 'ng-zorro-antd/layout';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-layout-responsive',
  imports: [TriIconModule, TriMenuModule, TriLayoutModule],
  template: `
    <tri-layout>
      <tri-sider collapsible breakpoint="lg" [collapsedWidth]="0">
        <div class="logo"></div>
        <ul tri-menu theme="dark" mode="inline">
          <li tri-menu-item>
            <tri-icon type="user" />
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
            <tri-icon type="user" />
            <span>nav 4</span>
          </li>
        </ul>
      </tri-sider>
      <tri-layout>
        <tri-header />
        <tri-content>
          <div class="inner-content">Content</div>
        </tri-content>
        <tri-footer>Ant Design ©{{ date.getFullYear() }} Implement By Angular</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: `
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
      margin: 24px 16px 0;
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
})
export class TriDemoLayoutResponsiveComponent {
  protected readonly date = new Date();
}
