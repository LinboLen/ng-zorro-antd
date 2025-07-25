import { Component } from '@angular/core';

import { TriTransferModule } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-status',
  imports: [TriTransferModule],
  template: `
    <tri-transfer [dataSource]="[]" status="error"></tri-transfer>
    <br />
    <tri-transfer [dataSource]="[]" status="warning" showSearch></tri-transfer>
  `
})
export class TriDemoTransferStatusComponent {}
