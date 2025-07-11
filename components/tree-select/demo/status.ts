import { Component } from '@angular/core';

import { TriTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'tri-demo-tree-select-status',
  imports: [TriTreeSelectModule],
  template: `
    <tri-tree-select [nodes]="[]" status="error" placeHolder="Error" style="width:100%;"></tri-tree-select>
    <br />
    <br />
    <tri-tree-select
      multiple
      [nodes]="[]"
      showSearch
      status="warning"
      placeHolder="Warning multiple"
      style="width:100%;"
    ></tri-tree-select>
  `
})
export class TriDemoTreeSelectStatusComponent {}
