import { Component } from '@angular/core';

import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-dropdown-item',
  imports: [TriDropdownModule, TriIconModule],
  template: `
    <a tri-dropdown [dropdownMenu]="menu">
      Hover me
      <tri-icon type="down" />
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-menu-divider></li>
        <li tri-menu-item disabled>3rd menu item（disabled）</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoDropdownItemComponent {}
