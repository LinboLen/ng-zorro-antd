import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMenuModule } from 'ng-zorro-antd/menu';
import { TriToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'tri-demo-menu-inline-collapsed',
  imports: [TriButtonModule, TriIconModule, TriMenuModule, TriToolTipModule],
  template: `
    <div class="wrapper">
      <button tri-button type="primary" (click)="toggleCollapsed()">
        <tri-icon [type]="isCollapsed ? 'menu-unfold' : 'menu-fold'" />
      </button>
      <ul tri-menu mode="inline" theme="dark" [inlineCollapsed]="isCollapsed">
        <li
          tri-menu-item
          tri-tooltip
          tooltipPlacement="right"
          [tooltipTitle]="isCollapsed ? 'Navigation One' : ''"
          selected
        >
          <tri-icon type="mail" />
          <span>Navigation One</span>
        </li>
        <li tri-submenu title="Navigation Two" icon="appstore">
          <ul>
            <li tri-menu-item>Option 5</li>
            <li tri-menu-item>Option 6</li>
            <li tri-submenu title="Submenu">
              <ul>
                <li tri-menu-item>Option 7</li>
                <li tri-menu-item>Option 8</li>
              </ul>
            </li>
          </ul>
        </li>
        <li tri-submenu title="Navigation Three" icon="setting">
          <ul>
            <li tri-menu-item>Option 9</li>
            <li tri-menu-item>Option 10</li>
            <li tri-menu-item>Option 11</li>
          </ul>
        </li>
      </ul>
    </div>
  `,
  styles: [
    `
      .wrapper {
        width: 240px;
      }

      button {
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoMenuInlineCollapsedComponent {
  isCollapsed = false;

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
