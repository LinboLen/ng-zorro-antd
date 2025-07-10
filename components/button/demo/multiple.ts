import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [TriButtonModule, TriDropDownModule, TriIconModule],
  template: `
    <button tri-button type="primary">primary</button>
    <button tri-button type="default">secondary</button>
    <button tri-button tri-dropdown [dropdownMenu]="menu">
      Actions
      <tri-icon type="down" />
    </button>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>
          <a>1st item</a>
        </li>
        <li tri-menu-item>
          <a>2nd item</a>
        </li>
        <li tri-menu-item>
          <a>3rd item</a>
        </li>
      </ul>
    </tri-dropdown-menu>
  `,
  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 12px;
      }
    `
  ]
})
export class TriDemoButtonMultipleComponent {}
