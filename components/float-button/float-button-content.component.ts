/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';

import { TriBadgeComponent } from 'ng-zorro-antd/badge';
import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriShapeSCType } from 'ng-zorro-antd/core/types';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriFloatButtonBadge } from './typings';

@Component({
  selector: 'tri-float-button-content',
  exportAs: 'triFloatButtonContent',
  imports: [TriIconModule, TriOutletModule, TriBadgeComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (badge()) {
      <tri-badge
        [dot]="badge()?.nzDot"
        [showDot]="badge()?.nzDot"
        [count]="badge()?.nzCount"
        [showZero]="badge()?.nzShowZero"
        [overflowCount]="badge()?.nzOverflowCount!"
        [color]="badge()?.nzColor"
        [offset]="badge()?.nzOffset"
        [size]="badge()?.nzSize || 'default'"
      >
        <ng-container *ngTemplateOutlet="button"></ng-container>
      </tri-badge>
    } @else {
      <ng-container *ngTemplateOutlet="button"></ng-container>
    }
    <ng-template #button>
      <div class="tri-float-btn-body">
        <div class="tri-float-btn-content">
          @if (description() || icon()) {
            @if (icon()) {
              <div class="tri-float-btn-icon">
                <ng-container *stringTemplateOutlet="icon(); let icon">
                  <tri-icon [type]="icon" theme="outline" />
                </ng-container>
              </div>
            }
            @if (description() && shape() === 'square') {
              <div class="tri-float-btn-description">
                <ng-container *stringTemplateOutlet="description()">
                  {{ description() }}
                </ng-container>
              </div>
            }
          } @else {
            <div class="tri-float-btn-icon">
              <tri-icon type="file-text" theme="outline" />
            </div>
          }
        </div>
      </div>
    </ng-template>
  `
})
export class TriFloatButtonContentComponent {
  readonly badge = input<TriFloatButtonBadge | null>(null);
  readonly icon = input<string | TemplateRef<void> | null>(null);
  readonly description = input<string | TemplateRef<void> | null>(null);
  readonly shape = input<TriShapeSCType>('circle');
}
