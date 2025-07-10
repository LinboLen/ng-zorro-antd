/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TriAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: '',
  exportAs: 'triListItemMetaTitle',
  template: `
    <h4 class="tri-list-item-meta-title">
      <ng-content></ng-content>
    </h4>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriListItemMetaTitleComponent {}

@Component({
  selector: '',
  exportAs: 'triListItemMetaDescription',
  template: `
    <div class="tri-list-item-meta-description">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriListItemMetaDescriptionComponent {}

@Component({
  selector: '',
  exportAs: 'triListItemMetaAvatar',
  template: `
    <div class="tri-list-item-meta-avatar">
      @if (src) {
        <tri-avatar [src]="src" />
      } @else {
        <ng-content />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriAvatarModule]
})
export class TriListItemMetaAvatarComponent {
  @Input() src?: string;
}
