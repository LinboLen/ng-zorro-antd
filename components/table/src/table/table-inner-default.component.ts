/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

import { TriTableLayout } from '../table.types';
import { TriTableContentComponent } from './table-content.component';

@Component({
  selector: 'tri-table-inner-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="tri-table-content">
      <table
        tri-table-content
        [contentTemplate]="contentTemplate"
        [tableLayout]="tableLayout"
        [listOfColWidth]="listOfColWidth"
        [theadTemplate]="theadTemplate"
        [tfootTemplate]="tfootTemplate"
      ></table>
    </div>
  `,
  host: { class: 'tri-table-container' },
  imports: [TriTableContentComponent]
})
export class TriTableInnerDefaultComponent {
  @Input() tableLayout: TriTableLayout = 'auto';
  @Input() listOfColWidth: ReadonlyArray<string | null> = [];
  @Input() theadTemplate: TemplateRef<TriSafeAny> | null = null;
  @Input() contentTemplate: TemplateRef<TriSafeAny> | null = null;
  @Input() tfootTemplate: TemplateRef<TriSafeAny> | null = null;
}
