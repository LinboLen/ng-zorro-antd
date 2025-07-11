import { Component } from '@angular/core';

import { TriLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'tri-demo-layout-basic',
  imports: [TriLayoutModule],
  template: `
    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-content>Content</tri-content>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-sider>Sider</tri-sider>
        <tri-content>Content</tri-content>
      </tri-layout>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-content>Content</tri-content>
        <tri-sider>Sider</tri-sider>
      </tri-layout>
      <tri-footer>Footer</tri-footer>
    </tri-layout>

    <tri-layout>
      <tri-sider>Sider</tri-sider>
      <tri-layout>
        <tri-header>Header</tri-header>
        <tri-content>Content</tri-content>
        <tri-footer>Footer</tri-footer>
      </tri-layout>
    </tri-layout>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }

      nz-header,
      nz-footer {
        background: #7dbcea;
        color: #fff;
      }

      nz-footer {
        line-height: 1.5;
      }

      nz-sider {
        background: #3ba0e9;
        color: #fff;
        line-height: 120px;
      }

      nz-content {
        background: rgba(16, 142, 233, 1);
        color: #fff;
        min-height: 120px;
        line-height: 120px;
      }

      nz-layout {
        margin-bottom: 48px;
      }

      nz-layout nz-layout,
      nz-layout:last-child {
        margin: 0;
      }
    `
  ]
})
export class TriDemoLayoutBasicComponent {}
