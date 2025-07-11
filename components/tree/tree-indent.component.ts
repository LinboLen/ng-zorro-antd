/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tri-tree-indent',
  exportAs: 'triTreeIndent',
  template: `
    @for (_ of listOfUnit; track i; let i = $index) {
      <span
        [class.tri-tree-indent-unit]="!selectMode"
        [class.tri-select-tree-indent-unit]="selectMode"
        [class.tri-select-tree-indent-unit-start]="selectMode && isStart[i]"
        [class.tri-tree-indent-unit-start]="!selectMode && isStart[i]"
        [class.tri-select-tree-indent-unit-end]="selectMode && isEnd[i]"
        [class.tri-tree-indent-unit-end]="!selectMode && isEnd[i]"
      ></span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': 'true',
    '[class.tri-tree-indent]': '!selectMode',
    '[class.tri-select-tree-indent]': 'selectMode'
  }
})
export class TriTreeIndentComponent implements OnChanges {
  @Input() treeLevel = 0;
  @Input() isStart: boolean[] = [];
  @Input() isEnd: boolean[] = [];
  @Input() selectMode = false;

  listOfUnit: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    const { nzTreeLevel } = changes;
    if (nzTreeLevel) {
      this.listOfUnit = [...new Array(nzTreeLevel.currentValue || 0)];
    }
  }
}
