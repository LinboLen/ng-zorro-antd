import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDropdownModule, TriPlacementType } from 'ng-zorro-antd/dropdown';
import { TriFlexModule } from 'ng-zorro-antd/flex';

@Component({
  selector: 'tri-demo-dropdown-arrow',
  imports: [TriDropdownModule, TriButtonModule, TriFlexModule],
  template: `
    <div tri-flex [gap]="8" wrap="wrap">
      @for (position of listOfPosition; track position) {
        <button tri-button tri-dropdown [dropdownMenu]="menu" [placement]="position" arrow>{{ position }}</button>
        <tri-dropdown-menu #menu="nzDropdownMenu">
          <ul tri-menu>
            <li tri-menu-item>1st menu item length</li>
            <li tri-menu-item>2nd menu item length</li>
            <li tri-menu-item>3rd menu item length</li>
          </ul>
        </tri-dropdown-menu>
      }
    </div>
  `
})
export class TriDemoDropdownArrowComponent {
  listOfPosition: TriPlacementType[] = ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'];
}
