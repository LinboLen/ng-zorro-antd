import { Component } from '@angular/core';

import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-menu-inline',
  imports: [TriMenuModule],
  template: `
    <ul tri-menu mode="inline">
      <li tri-submenu title="Navigation One" icon="mail" open>
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
              <li tri-submenu title="Submenu">
                <ul>
                  <li tri-menu-item>Option 9</li>
                  <li tri-menu-item>Option 10</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li tri-submenu title="Navigation Three" icon="setting">
        <ul>
          <li tri-menu-item>Option 11</li>
          <li tri-menu-item>Option 12</li>
          <li tri-menu-item>Option 13</li>
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
export class TriDemoMenuInlineComponent {}
