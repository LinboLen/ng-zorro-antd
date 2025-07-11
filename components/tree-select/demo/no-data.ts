import { Component } from '@angular/core';

import { TriSpinModule } from 'ng-zorro-antd/spin';
import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-no-data',
  imports: [TriSpinModule, TriTreeSelectModule],
  template: `
    <tri-tree-select
      style="width: 250px"
      [nodes]="[]"
      placeHolder="Please select"
      [notFoundContent]="noData"
    ></tri-tree-select>
    <ng-template #noData>
      <div style="height: 200px; display: flex; justify-content: center; align-items: center">
        <tri-spin simple></tri-spin>
      </div>
    </ng-template>
  `
})
export class TriDemoTreeSelectNoDataComponent {}
