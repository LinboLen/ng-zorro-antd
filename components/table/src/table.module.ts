/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { TriFilterTriggerComponent } from './addon/filter-trigger.component';
import { TriTableFilterComponent } from './addon/filter.component';
import { TriRowExpandButtonDirective } from './addon/row-expand-button.directive';
import { TriRowIndentDirective } from './addon/row-indent.directive';
import { TriTableSelectionComponent } from './addon/selection.component';
import { TriTableSortersComponent } from './addon/sorters.component';
import { TriCellFixedDirective } from './cell/cell-fixed.directive';
import { TriTableCellDirective } from './cell/cell.directive';
import { TriCustomColumnDirective } from './cell/custom-column.directive';
import { TriTdAddOnComponent } from './cell/td-addon.component';
import { TriThAddOnComponent } from './cell/th-addon.component';
import { TriThMeasureDirective } from './cell/th-measure.directive';
import { TriThSelectionComponent } from './cell/th-selection.component';
import { TriCellAlignDirective } from './styled/align.directive';
import { TriCellEllipsisDirective } from './styled/ellipsis.directive';
import { TriCellBreakWordDirective } from './styled/word-break.directive';
import { TriTableContentComponent } from './table/table-content.component';
import { TriTableFixedRowComponent } from './table/table-fixed-row.component';
import { TriTableInnerDefaultComponent } from './table/table-inner-default.component';
import { TriTableInnerScrollComponent } from './table/table-inner-scroll.component';
import { TriTableVirtualScrollDirective } from './table/table-virtual-scroll.directive';
import { TriTableComponent } from './table/table.component';
import { TriTbodyComponent } from './table/tbody.component';
import { TriTfootSummaryComponent } from './table/tfoot-summary.component';
import { TriTheadComponent } from './table/thead.component';
import { TriTableTitleFooterComponent } from './table/title-footer.component';
import { TriTrExpandDirective } from './table/tr-expand.directive';
import { TriTrMeasureComponent } from './table/tr-measure.component';
import { TriTrDirective } from './table/tr.directive';

@NgModule({
  imports: [
    TriTableComponent,
    TriThAddOnComponent,
    TriTableCellDirective,
    TriThMeasureDirective,
    TriTdAddOnComponent,
    TriTheadComponent,
    TriTbodyComponent,
    TriTrDirective,
    TriTrExpandDirective,
    TriTfootSummaryComponent,
    TriTableVirtualScrollDirective,
    TriCellFixedDirective,
    TriCustomColumnDirective,
    TriTableContentComponent,
    TriTableTitleFooterComponent,
    TriTableInnerDefaultComponent,
    TriTableInnerScrollComponent,
    TriTrMeasureComponent,
    TriRowIndentDirective,
    TriRowExpandButtonDirective,
    TriCellBreakWordDirective,
    TriCellAlignDirective,
    TriTableSortersComponent,
    TriTableFilterComponent,
    TriTableSelectionComponent,
    TriCellEllipsisDirective,
    TriFilterTriggerComponent,
    TriTableFixedRowComponent,
    TriThSelectionComponent
  ],
  exports: [
    TriTableComponent,
    TriThAddOnComponent,
    TriTableCellDirective,
    TriThMeasureDirective,
    TriTdAddOnComponent,
    TriTheadComponent,
    TriTbodyComponent,
    TriTrDirective,
    TriTableVirtualScrollDirective,
    TriCellFixedDirective,
    TriCustomColumnDirective,
    TriFilterTriggerComponent,
    TriTrExpandDirective,
    TriTfootSummaryComponent,
    TriCellBreakWordDirective,
    TriCellAlignDirective,
    TriCellEllipsisDirective,
    TriTableFixedRowComponent,
    TriThSelectionComponent
  ]
})
export class TriTableModule {}
