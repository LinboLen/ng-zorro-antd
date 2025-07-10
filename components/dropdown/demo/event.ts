import { Component } from '@angular/core';

import { TriDropDownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  imports: [TriDropDownModule, TriIconModule],
  template: `
    <a tri-dropdown [dropdownMenu]="menu">
      Hover me, Click menu item
      <tri-icon type="down" />
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item (click)="log('1st menu item')">1st menu item</li>
        <li tri-menu-item (click)="log('2nd menu item')">2nd menu item</li>
        <li tri-menu-item (click)="log('3rd menu item')">3rd menu item</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoDropdownEventComponent {
  log(data: string): void {
    console.log(data);
  }
}
