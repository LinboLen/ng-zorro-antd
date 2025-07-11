/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';

import { TriStringTemplateOutletDirective } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-float-button-content',
  exportAs: 'triFloatButtonContent',
  imports: [TriIconModule, NgTemplateOutlet, TriStringTemplateOutletDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tri-float-btn-body">
      <div class="tri-float-btn-content">
        @if (description || icon) {
          @if (icon) {
            <div class="tri-float-btn-icon">
              <ng-template [ngTemplateOutlet]="icon"></ng-template>
            </div>
          }
          @if (description && shape === 'square') {
            <div class="tri-float-btn-description">
              <ng-container *stringTemplateOutlet="description">
                {{ description }}
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
  `
})
export class TriFloatButtonContentComponent {
  @Input() icon: TemplateRef<void> | null = null;
  @Input() description: string | TemplateRef<void> | null = null;
  @Input() shape: 'circle' | 'square' = 'circle';
}
