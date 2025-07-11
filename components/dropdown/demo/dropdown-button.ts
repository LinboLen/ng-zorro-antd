import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-dropdown-dropdown-button',
  imports: [TriButtonModule, TriDropDownModule, TriFlexModule, TriIconModule, TriSpaceModule],
  template: `
    <div tri-flex gap="small" wrap="wrap">
      <tri-space-compact>
        <button tri-button (click)="log()">DropDown</button>
        <button tri-button tri-dropdown [dropdownMenu]="menu" placement="bottomRight">
          <tri-icon type="ellipsis" />
        </button>
      </tri-space-compact>
      <tri-space-compact>
        <button tri-button (click)="log()">DropDown</button>
        <button tri-button tri-dropdown [dropdownMenu]="menu" placement="bottomRight">
          <tri-icon type="user" />
        </button>
      </tri-space-compact>
      <tri-space-compact>
        <button tri-button disabled>DropDown</button>
        <button tri-button disabled tri-dropdown [dropdownMenu]="menu" placement="bottomRight">
          <tri-icon type="ellipsis" />
        </button>
      </tri-space-compact>
      <button tri-button tri-dropdown [dropdownMenu]="menu">
        Button
        <tri-icon type="down" />
      </button>
    </div>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>menu 1st menu item</li>
        <li tri-menu-item>menu 2nd menu item</li>
        <li tri-menu-item>menu 3rd menu item</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoDropdownDropdownButtonComponent {
  log(): void {
    console.log('click dropdown button');
  }
}
