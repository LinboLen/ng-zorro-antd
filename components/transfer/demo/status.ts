import { Component } from '@angular/core';

import { TriTransferModule } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'tri-demo-transfer-status',
  imports: [TriTransferModule],
  template: `
    <tri-transfer [dataSource]="[]" status="error" />
    <br />
    <tri-transfer [dataSource]="[]" status="warning" showSearch />
  `
})
export class TriDemoTransferStatusComponent {}
