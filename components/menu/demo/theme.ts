import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriMenuModule } from 'ng-zorro-antd/menu';
import { TriSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: '',
  imports: [FormsModule, TriMenuModule, TriSwitchModule],
  template: `
    <tri-switch [(ngModel)]="theme">
      <span checked>Dark</span>
      <span unchecked>Light</span>
    </tri-switch>
    <br />
    <br />
    <ul tri-menu mode="inline" style="width: 240px;" [theme]="theme ? 'dark' : 'light'">
      <li tri-submenu open title="Navigation One" icon="mail">
        <ul>
          <li tri-menu-group title="Item 1">
            <ul>
              <li tri-menu-item selected>Option 1</li>
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
  `
})
export class TriDemoMenuThemeComponent {
  theme = true;
}
