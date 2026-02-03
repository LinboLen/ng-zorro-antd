/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  inject,
  OnInit,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriSiderComponent } from './sider.component';

@Component({
  selector: 'tri-layout',
  exportAs: 'triLayout',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-layout',
    '[class.tri-layout-rtl]': `dir === 'rtl'`,
    '[class.tri-layout-has-sider]': 'listOfNzSiderComponent.length > 0'
  }
})
export class TriLayoutComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private directionality = inject(Directionality);
  @ContentChildren(TriSiderComponent) listOfNzSiderComponent!: QueryList<TriSiderComponent>;

  dir: Direction = 'ltr';

  ngOnInit(): void {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
    });
  }
}
