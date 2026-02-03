/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  input,
  TemplateRef,
  Component,
  ViewEncapsulation,
  viewChild,
  booleanAttribute,
  ChangeDetectionStrategy
} from '@angular/core';

import { TriSplitterCollapsible } from './typings';

@Component({
  selector: 'tri-splitter-panel',
  exportAs: 'triSplitterPanel',
  template: `
    <ng-template #contentTemplate>
      <ng-content />
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TriSplitterPanelComponent {
  readonly defaultSize = input<number | string>();
  readonly min = input<number | string>();
  readonly max = input<number | string>();
  readonly size = input<number | string>();
  readonly collapsible = input<TriSplitterCollapsible>(false);
  readonly resizable = input(true, { transform: booleanAttribute });
  readonly contentTemplate = viewChild.required<TemplateRef<void>>('contentTemplate');
}
