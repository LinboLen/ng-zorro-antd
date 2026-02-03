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
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      text-align: center;
    }

    nz-header,
    nz-footer {
      text-align: center;
      background: #4096ff;
      color: #fff;
    }

    nz-header {
      height: 64px;
      padding-inline: 48px;
      line-height: 64px;
    }

    nz-sider {
      text-align: center;
      background: #1677ff;
      color: #fff;
      line-height: 120px;
    }

    nz-content {
      text-align: center;
      background: #0958d9;
      color: #fff;
      min-height: 120px;
      line-height: 120px;
    }

    :host > nz-layout {
      width: calc(50% - 8px);
      max-width: calc(50% - 8px);
      border-radius: 8px;
      overflow: hidden;
    }
  `
})
export class TriDemoLayoutBasicComponent {}
