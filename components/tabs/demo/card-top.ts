import { Component } from '@angular/core';

import { TriTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'tri-demo-tabs-card-top',
  imports: [TriTabsModule],
  template: `
    <div class="card-container">
      <tri-tabs type="card">
        @for (tab of tabs; track tab) {
          <tri-tab [title]="'Tab Title ' + tab">
            <p>Content of Tab Pane {{ tab }}</p>
            <p>Content of Tab Pane {{ tab }}</p>
            <p>Content of Tab Pane {{ tab }}</p>
          </tri-tab>
        }
      </tri-tabs>
    </div>
  `,
  styles: `
    :host {
      background: #f5f5f5;
      overflow: hidden;
      padding: 24px;
      display: block;
    }

    .card-container ::ng-deep p {
      margin: 0;
    }
    .card-container ::ng-deep > .ant-tabs-card .ant-tabs-content {
      height: 120px;
      margin-top: -16px;
    }
    .card-container ::ng-deep > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
      background: #fff;
      padding: 16px;
    }
    .card-container ::ng-deep > .ant-tabs-card > .ant-tabs-nav::before {
      display: none;
    }
    .card-container ::ng-deep > .ant-tabs-card .ant-tabs-tab {
      border-color: transparent;
      background: transparent;
    }
    .card-container ::ng-deep > .ant-tabs-card .ant-tabs-tab-active {
      border-color: #fff;
      background: #fff;
    }
  `
})
export class TriDemoTabsCardTopComponent {
  tabs = [1, 2, 3];
}
