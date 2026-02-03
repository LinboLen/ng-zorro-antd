import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-jump',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="2" [total]="500" showQuickJumper />
    <br />
    <tri-pagination [pageIndex]="2" [total]="500" showQuickJumper disabled />
  `
})
export class TriDemoPaginationJumpComponent {}
