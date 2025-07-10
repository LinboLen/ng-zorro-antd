/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { TriBreakpointKey } from 'ng-zorro-antd/core/services';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: '',
  exportAs: 'triSiderTrigger',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isZeroTrigger) {
      <ng-template [ngTemplateOutlet]="zeroTrigger || defaultZeroTrigger" />
    }

    @if (isNormalTrigger) {
      <ng-template [ngTemplateOutlet]="trigger || defaultTrigger" />
    }
    <ng-template #defaultTrigger>
      @if (reverseArrow) {
        <tri-icon [type]="collapsed ? 'left' : 'right'" />
      } @else {
        <tri-icon [type]="collapsed ? 'right' : 'left'" />
      }
    </ng-template>
    <ng-template #defaultZeroTrigger>
      <tri-icon type="bars" />
    </ng-template>
  `,
  host: {
    '[class.tri-layout-sider-trigger]': 'isNormalTrigger',
    '[style.width]': 'isNormalTrigger ? siderWidth : null',
    '[class.tri-layout-sider-zero-width-trigger]': 'isZeroTrigger',
    '[class.tri-layout-sider-zero-width-trigger-right]': 'isZeroTrigger && reverseArrow',
    '[class.tri-layout-sider-zero-width-trigger-left]': 'isZeroTrigger && !reverseArrow'
  },
  imports: [NgTemplateOutlet, TriIconModule]
})
export class TriSiderTriggerComponent implements OnChanges, OnInit {
  @Input() collapsed = false;
  @Input() reverseArrow = false;
  @Input() zeroTrigger: TemplateRef<void> | null = null;
  @Input() trigger: TemplateRef<void> | undefined | null = undefined;
  @Input() matchBreakPoint = false;
  @Input() collapsedWidth: number | null = null;
  @Input() siderWidth: string | null = null;
  @Input() breakpoint: TriBreakpointKey | null = null;
  isZeroTrigger = false;
  isNormalTrigger = false;
  updateTriggerType(): void {
    this.isZeroTrigger =
      this.collapsedWidth === 0 && ((this.breakpoint && this.matchBreakPoint) || !this.breakpoint);
    this.isNormalTrigger = this.collapsedWidth !== 0;
  }
  ngOnInit(): void {
    this.updateTriggerType();
  }
  ngOnChanges(): void {
    this.updateTriggerType();
  }
}
