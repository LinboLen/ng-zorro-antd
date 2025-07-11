/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';
import { TriIconModule } from 'ng-zorro-antd/icon';

import { ModalOptions } from './modal-types';

@Component({
  selector: 'button[nz-modal-close]',
  exportAs: 'triModalCloseBuiltin',
  template: `
    <span class="tri-modal-close-x">
      <ng-container *stringTemplateOutlet="closeIcon; let closeIcon">
        <tri-icon [type]="closeIcon" class="tri-modal-close-icon" />
      </ng-container>
    </span>
  `,
  host: {
    class: 'tri-modal-close',
    'aria-label': 'Close'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriIconModule, TriOutletModule]
})
export class TriModalCloseComponent {
  public readonly config = inject(ModalOptions);
}
