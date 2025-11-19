import { Component } from '@angular/core';

import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-dropdown-sub-menu',
  imports: [TriDropdownModule, TriIconModule],
  template: `
    <a tri-dropdown [dropdownMenu]="menu" (visibleChange)="change($event)">
      Cascading menu
      <tri-icon type="down" />
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-submenu title="sub menu">
          <ul>
            <li tri-menu-item>3rd menu item</li>
            <li tri-menu-item>4th menu item</li>
          </ul>
        </li>
        <li tri-submenu disabled title="disabled sub menu">
          <ul>
            <li tri-menu-item>3rd menu item</li>
            <li tri-menu-item>4th menu item</li>
          </ul>
        </li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoDropdownSubMenuComponent {
  change(value: boolean): void {
    console.log(value);
  }
}
