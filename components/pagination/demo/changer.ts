import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-changer',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="3" [total]="500" showSizeChanger [pageSize]="10"></tri-pagination>
    <br />
    <tri-pagination [pageIndex]="3" [total]="500" showSizeChanger [pageSize]="10" disabled></tri-pagination>
  `
})
export class TriDemoPaginationChangerComponent {}
