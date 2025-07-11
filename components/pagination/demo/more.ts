import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-more',
  imports: [TriPaginationModule],
  template: `<tri-pagination [pageIndex]="1" [total]="500"></tri-pagination>`
})
export class TriDemoPaginationMoreComponent {}
