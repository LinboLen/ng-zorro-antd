import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-changer',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="3" [total]="500" showSizeChanger [pageSize]="10" />
    <br />
    <tri-pagination [pageIndex]="3" [total]="500" showSizeChanger [pageSize]="10" disabled />
  `
})
export class TriDemoPaginationChangerComponent {}
