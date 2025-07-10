import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDropDownModule, TriPlacementType } from 'ng-zorro-antd/dropdown';

@Component({
  selector: '',
  imports: [TriDropDownModule, TriButtonModule],
  template: `
    <div>
      @for (position of listOfPosition; track position) {
        <button tri-button tri-dropdown [dropdownMenu]="menu" [placement]="position">{{ position }}</button>
        <tri-dropdown-menu #menu="nzDropdownMenu">
          <ul tri-menu>
            <li tri-menu-item>1st menu item length</li>
            <li tri-menu-item>2nd menu item length</li>
            <li tri-menu-item>3rd menu item length</li>
          </ul>
        </tri-dropdown-menu>
      }
    </div>
  `,
  styles: [
    `
      [nz-button] {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    `
  ]
})
export class TriDemoDropdownPlacementComponent {
  listOfPosition: TriPlacementType[] = ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'];
}
