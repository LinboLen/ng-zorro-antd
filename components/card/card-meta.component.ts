/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

@Component({
  selector: 'tri-card-meta',
  exportAs: 'triCardMeta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (avatar) {
      <div class="tri-card-meta-avatar">
        <ng-template [ngTemplateOutlet]="avatar" />
      </div>
    }

    @if (title || description) {
      <div class="tri-card-meta-detail">
        @if (title) {
          <div class="tri-card-meta-title">
            <ng-container *stringTemplateOutlet="title">{{ title }}</ng-container>
          </div>
        }
        @if (description) {
          <div class="tri-card-meta-description">
            <ng-container *stringTemplateOutlet="description">{{ description }}</ng-container>
          </div>
        }
      </div>
    }
  `,
  host: { class: 'tri-card-meta' },
  imports: [NgTemplateOutlet, TriOutletModule]
})
export class TriCardMetaComponent {
  @Input() title: string | TemplateRef<void> | null = null;
  @Input() description: string | TemplateRef<void> | null = null;
  @Input() avatar: TemplateRef<void> | null = null;
}
