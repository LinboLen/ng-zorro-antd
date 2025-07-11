import { Component } from '@angular/core';

import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'tri-demo-menu-vertical',
  imports: [TriMenuModule],
  template: `
    <ul tri-menu [mode]="'vertical'">
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
      <li tri-submenu (openChange)="change($event)" title="Navigation Two" icon="appstore">
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
export class TriDemoMenuVerticalComponent {
  change(value: boolean): void {
    console.log(value);
  }
}
