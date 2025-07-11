import { Component } from '@angular/core';

import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-menu-sider-current',
  imports: [TriMenuModule],
  template: `
    <ul tri-menu mode="inline" style="width: 240px;">
      <li
        tri-submenu
        [(openChange)]="openMap.sub1"
        (openChange)="openHandler('sub1')"
        title="Navigation One"
        icon="mail"
      >
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
      <li
        tri-submenu
        [(openChange)]="openMap.sub2"
        (openChange)="openHandler('sub2')"
        title="Navigation Two"
        icon="appstore"
      >
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
      <li
        tri-submenu
        [(openChange)]="openMap.sub3"
        (openChange)="openHandler('sub3')"
        title="Navigation Three"
        icon="setting"
      >
        <ul>
          <li tri-menu-item>Option 9</li>
          <li tri-menu-item>Option 10</li>
          <li tri-menu-item>Option 11</li>
        </ul>
      </li>
    </ul>
  `
})
export class TriDemoMenuSiderCurrentComponent {
  openMap: { [name: string]: boolean } = {
    sub1: true,
    sub2: false,
    sub3: false
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}
