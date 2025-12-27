/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directionality } from '@angular/cdk/bidi';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute,
  inject
} from '@angular/core';

import { withAnimationCheck } from 'ng-zorro-antd/core/animation';
import { TriConfigKey, WithConfig } from 'ng-zorro-antd/core/config';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { NgStyleInterface, TriSafeAny, TriSizeDSType } from 'ng-zorro-antd/core/types';

import { TriBadgeSupComponent } from './badge-sup.component';
import { badgePresetColors } from './preset-colors';
import { TriBadgeStatusType } from './types';

const TRI_CONFIG_MODULE_NAME: TriConfigKey = 'badge';

@Component({
  selector: 'tri-badge',
  exportAs: 'triBadge',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriBadgeSupComponent, TriOutletModule],
  template: `
    @if ((status || color) && !showSup && !count) {
      <span
        class="tri-badge-status-dot"
        [class]="(status || presetColor) && 'ant-badge-status-' + (status || presetColor)"
        [style]="mergedStyle"
      ></span>
      <span class="tri-badge-status-text">
        <ng-container *stringTemplateOutlet="text">{{ text }}</ng-container>
      </span>
    }
    <ng-content />
    <ng-container *stringTemplateOutlet="count">
      @if (showSup) {
        <tri-badge-sup
          [isPresetColor]="status || presetColor"
          [color]="status || presetColor || color"
          [offset]="offset"
          [size]="size"
          [title]="title"
          [style]="mergedStyle"
          [dot]="dot"
          [count]="count"
          [overflowCount]="overflowCount"
          [animate.enter]="supAnimationEnter()"
          [animate.leave]="supAnimationLeave()"
        />
      }
    </ng-container>
  `,
  host: {
    class: 'tri-badge',
    '[class.tri-badge-status]': 'status',
    '[class.tri-badge-not-a-wrapper]': '!!(standalone || ((status || color) && !showSup && !count))',
    '[class.tri-badge-rtl]': 'dir() === "rtl"'
  }
})
export class TriBadgeComponent implements OnChanges {
  protected readonly dir = inject(Directionality).valueSignal;

  readonly _nzModuleName: TriConfigKey = TRI_CONFIG_MODULE_NAME;

  protected showSup = false;
  protected readonly supAnimationEnter = withAnimationCheck(() => 'ant-badge-zoom-enter');
  protected readonly supAnimationLeave = withAnimationCheck(() => 'ant-badge-zoom-leave');
  presetColor: string | null = null;

  @Input({ transform: booleanAttribute }) showZero = false;
  @Input({ transform: booleanAttribute }) showDot = true;
  @Input({ transform: booleanAttribute }) standalone = false;
  @Input({ transform: booleanAttribute }) dot = false;
  @Input() @WithConfig() overflowCount: number = 99;
  @Input() @WithConfig() color?: string;
  @Input() style: NgStyleInterface | null = null;
  @Input() text?: string | TemplateRef<void> | null = null;
  @Input() title?: string | null | undefined;
  @Input() status?: TriBadgeStatusType | string;
  @Input() count?: number | TemplateRef<TriSafeAny>;
  @Input() offset?: [number, number];
  @Input() size: TriSizeDSType = 'default';

  protected get mergedStyle(): NgStyleInterface {
    return { backgroundColor: !this.presetColor && this.color, ...(this.style ?? {}) };
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzColor, nzShowDot, nzDot, nzCount, nzShowZero } = changes;
    if (nzColor) {
      this.presetColor = this.color && badgePresetColors.indexOf(this.color) !== -1 ? this.color : null;
    }
    if (nzShowDot || nzDot || nzCount || nzShowZero) {
      this.showSup =
        (this.showDot && this.dot) || (typeof this.count === 'number' && (this.count > 0 || this.showZero));
    }
  }
}
