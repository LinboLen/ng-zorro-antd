import { Component } from '@angular/core';

import { TriDropdownModule } from 'ng-zorro-antd/dropdown';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-dropdown-overlay-visible',
  imports: [TriDropdownModule, TriIconModule],
  template: `
    <a tri-dropdown [dropdownMenu]="menu" [clickHide]="false" [(visibleChange)]="visible">
      Hover me
      <tri-icon type="down" />
    </a>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>Clicking me will not close the menu.</li>
        <li tri-menu-item>Clicking me will not close the menu also.</li>
        <li tri-menu-item (click)="visible = false">Clicking me will close the menu</li>
      </ul>
    </tri-dropdown-menu>
  `
})
export class TriDemoDropdownOverlayVisibleComponent {
  visible = false;
}
