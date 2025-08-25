/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Direction, Directionality } from '@angular/cdk/bidi';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriConfigKey, onConfigChangeEventForComponent, WithConfig } from 'ng-zorro-antd/core/config';
import type { TriSizeLMSType } from 'ng-zorro-antd/core/types';

import { TriCollapsePanelComponent } from './collapse-panel.component';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'collapse';

@Component({
  selector: 'tri-collapse',
  exportAs: 'triCollapse',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    class: 'tri-collapse',
    '[class.tri-collapse-icon-position-start]': `expandIconPosition === 'start'`,
    '[class.tri-collapse-icon-position-end]': `expandIconPosition === 'end'`,
    '[class.tri-collapse-ghost]': `ghost`,
    '[class.tri-collapse-borderless]': '!bordered',
    '[class.tri-collapse-rtl]': "dir === 'rtl'",
    '[class.tri-collapse-small]': `size === 'small'`,
    '[class.tri-collapse-large]': `size === 'large'`
  }
})
export class TriCollapseComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private directionality = inject(Directionality);
  private destroyRef = inject(DestroyRef);

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  @Input({ transform: booleanAttribute }) @WithConfig() accordion: boolean = false;
  @Input({ transform: booleanAttribute }) @WithConfig() bordered: boolean = true;
  @Input({ transform: booleanAttribute }) @WithConfig() ghost: boolean = false;
  @Input() expandIconPosition: 'start' | 'end' = 'start';
  @Input() size: TriSizeLMSType = 'middle';

  dir: Direction = 'ltr';

  private listOfNzCollapsePanelComponent: TriCollapsePanelComponent[] = [];

  constructor() {
    onConfigChangeEventForComponent(TRI_CONFIG_MODULE_NAME, () => this.cdr.markForCheck());
  }

  ngOnInit(): void {
    this.directionality.change?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(direction => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.dir = this.directionality.value;
  }

  addPanel(value: TriCollapsePanelComponent): void {
    this.listOfNzCollapsePanelComponent.push(value);
  }

  removePanel(value: TriCollapsePanelComponent): void {
    this.listOfNzCollapsePanelComponent.splice(this.listOfNzCollapsePanelComponent.indexOf(value), 1);
  }

  click(collapse: TriCollapsePanelComponent): void {
    if (this.accordion && !collapse.active) {
      this.listOfNzCollapsePanelComponent
        .filter(item => item !== collapse)
        .forEach(item => {
          if (item.active) {
            item.active = false;
            item.activeChange.emit(item.active);
            item.markForCheck();
          }
        });
    }
    collapse.active = !collapse.active;
    collapse.activeChange.emit(collapse.active);
  }
}
