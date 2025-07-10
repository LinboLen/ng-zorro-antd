import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: '',
  imports: [TriIconModule, TriMenuModule],
  template: `
    <ul tri-menu mode="horizontal">
      <li tri-menu-item selected>
        <tri-icon type="mail" />
        Navigation One
      </li>
      <li tri-menu-item disabled>
        <tri-icon type="appstore" />
        Navigation Two
      </li>
      <li tri-submenu title="Navigation Three - Submenu" icon="setting">
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
              <li tri-submenu title="Sub Menu">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu title="Click me" [triggerSubMenuAction]="'click'">
                <ul>
                  <li tri-menu-item disabled>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
              <li tri-submenu disabled title="Disabled Sub Menu">
                <ul>
                  <li tri-menu-item>Option 5</li>
                  <li tri-menu-item>Option 6</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-menu-item>
        <a href="https://ng.ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
      </li>
    </ul>
  `
})
export class TriDemoMenuHorizontalComponent {}
