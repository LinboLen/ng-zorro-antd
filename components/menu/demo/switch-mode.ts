import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriDividerModule } from 'ng-zorro-antd/divider';
import { TriMenuModule } from 'ng-zorro-antd/menu';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'tri-demo-menu-switch-mode',
  imports: [FormsModule, TriDividerModule, TriMenuModule, TriSwitchModule],
  template: `
    <tri-switch [(ngModel)]="mode"></tri-switch>
    Change Mode
    <tri-divider type="vertical"></tri-divider>
    <tri-switch [(ngModel)]="dark"></tri-switch>
    Change Theme
    <br />
    <br />
    <ul tri-menu [mode]="mode ? 'vertical' : 'inline'" [theme]="dark ? 'dark' : 'light'">
      <li tri-submenu title="Navigation One" icon="mail">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item>Option 1</li>
              <li tri-menu-item>Option 2</li>
            </ul>
          </li>
          <li tri-menu-group title="Item 2">
            <ul>
              <li tri-menu-item>Option 3</li>
              <li tri-menu-item>Option 4</li>
            </ul>
          </li>
        </ul>
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
  `,
  styles: [
    `
      [nz-menu] {
        width: 240px;
      }
    `
  ]
})
export class TriDemoMenuSwitchModeComponent {
  mode = false;
  dark = false;
}
