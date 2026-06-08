/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import { Component, ContentChildren, inject, QueryList, ViewEncapsulation } from '@angular/core';

import { TriSiderComponent } from './sider.component';

@Component({
  selector: 'tri-layout',
  exportAs: 'triLayout',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-layout',
    '[class.tri-layout-rtl]': `dir() === 'rtl'`,
    '[class.tri-layout-has-sider]': 'listOfNzSiderComponent.length > 0'
  }
})
export class TriLayoutComponent {
  protected readonly dir = inject(Directionality).valueSignal;
  @ContentChildren(TriSiderComponent) listOfNzSiderComponent!: QueryList<TriSiderComponent>;
}
