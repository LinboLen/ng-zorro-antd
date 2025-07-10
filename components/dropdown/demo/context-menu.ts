import { Component } from '@angular/core';

import { TriContextMenuService, TriDropdownMenuComponent, TriDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: '',
  imports: [TriDropDownModule],
  template: `
    <div class="context-area" (contextmenu)="contextMenu($event, menu)">Right Click on here</div>
    <tri-dropdown-menu #menu="nzDropdownMenu">
      <ul tri-menu>
        <li tri-menu-item>1st menu item</li>
        <li tri-menu-item>2nd menu item</li>
        <li tri-menu-item disabled>disabled menu item</li>
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
  `,
  styles: [
    `
      .context-area {
        background: #f7f7f7;
        color: #777;
        text-align: center;
        height: 200px;
        line-height: 200px;
      }
    `
  ]
})
export class TriDemoDropdownContextMenuComponent {
  contextMenu($event: MouseEvent, menu: TriDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  constructor(private nzContextMenuService: TriContextMenuService) {}
}
