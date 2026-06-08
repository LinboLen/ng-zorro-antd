/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Component, inject } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

import { ModalOptions } from './modal-types';

@Component({
  selector: 'div[nz-modal-title]',
  exportAs: 'triModalTitleBuiltin',
  template: `
    <div class="tri-modal-title">
      <ng-container *stringTemplateOutlet="title">
        <div [innerHTML]="title"></div>
      </ng-container>
    </div>
  `,
  host: {
    class: 'tri-modal-header'
  },
  imports: [TriOutletModule]
})
export class TriModalTitleComponent {
  public config = inject(ModalOptions);
}
