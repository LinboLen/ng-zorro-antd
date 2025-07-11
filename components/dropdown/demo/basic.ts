import { Component } from '@angular/core';

import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-dropdown-basic',
  imports: [TriDropDownModule, TriIconModule],
  template: `
    <a tri-dropdown [dropdownMenu]="menu">
      Hover me
      <tri-icon type="down" />
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu selectable>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-menu-item>3rd menu item</li>
        <li tri-menu-item danger>4th danger item</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoDropdownBasicComponent {}
