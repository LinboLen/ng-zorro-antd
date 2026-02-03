/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

@Component({
  selector: 'tri-auto-optgroup',
  exportAs: 'triAutoOptgroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [TriOutletModule],
  template: `
    <div class="tri-select-item tri-select-item-group">
      <ng-container *stringTemplateOutlet="label">{{ label }}</ng-container>
    </div>
    <ng-content select="nz-auto-option" />
  `
})
export class TriAutocompleteOptgroupComponent {
  @Input() label?: string | TemplateRef<void>;
}
