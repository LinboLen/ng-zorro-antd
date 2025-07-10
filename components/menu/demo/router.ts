import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TriMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: '',
  imports: [RouterLink, TriMenuModule],
  template: `
    <ul tri-menu mode="horizontal">
      <li tri-menu-item matchRouter>
        <a [routerLink]="['/', 'components', 'menu', 'en']">English Menu Document</a>
      </li>
      <li tri-menu-item matchRouter>
        <a [routerLink]="['/', 'components', 'menu', 'zh']">Chinese Menu Document</a>
      </li>
    </ul>
  `
})
export class TriDemoMenuRouterComponent {}
