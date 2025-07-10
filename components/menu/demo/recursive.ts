import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: '',
  imports: [NgTemplateOutlet, TriIconModule, TriMenuModule],
  template: `
    <ul tri-menu mode="inline" style="width: 240px;">
      <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menus }"></ng-container>
      <ng-template #menuTpl let-menus>
        @for (menu of menus; track menu) {
          @if (!menu.children) {
            <li
              tri-menu-item
              [paddingLeft]="menu.level * 24"
              [disabled]="menu.disabled"
              [selected]="menu.selected"
            >
              @if (menu.icon) {
                <tri-icon [type]="menu.icon" />
              }
              <span>{{ menu.title }}</span>
            </li>
          } @else {
            <li
              tri-submenu
              [paddingLeft]="menu.level * 24"
              [open]="menu.open"
              [title]="menu.title"
              [icon]="menu.icon"
              [disabled]="menu.disabled"
            >
              <ul>
                <ng-container *ngTemplateOutlet="menuTpl; context: { $implicit: menu.children }" />
              </ul>
            </li>
          }
        }
      </ng-template>
    </ul>
  `
})
export class TriDemoMenuRecursiveComponent {
  mode = false;
  dark = false;
  menus = [
    {
      level: 1,
      title: 'Mail Group',
      icon: 'mail',
      open: true,
      selected: false,
      disabled: false,
      children: [
        {
          level: 2,
          title: 'Group 1',
          icon: 'bars',
          open: false,
          selected: false,
          disabled: false,
          children: [
            {
              level: 3,
              title: 'Option 1',
              selected: false,
              disabled: false
            },
            {
              level: 3,
              title: 'Option 2',
              selected: false,
              disabled: true
            }
          ]
        },
        {
          level: 2,
          title: 'Group 2',
          icon: 'bars',
          selected: true,
          disabled: false
        },
        {
          level: 2,
          title: 'Group 3',
          icon: 'bars',
          selected: false,
          disabled: false
        }
      ]
    },
    {
      level: 1,
      title: 'Team Group',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
      children: [
        {
          level: 2,
          title: 'User 1',
          icon: 'user',
          selected: false,
          disabled: false
        },
        {
          level: 2,
          title: 'User 2',
          icon: 'user',
          selected: false,
          disabled: false
        }
      ]
    }
  ];
}
