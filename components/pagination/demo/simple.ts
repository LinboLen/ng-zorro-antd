import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-simple',
  imports: [TriPaginationModule],
  template: `<tri-pagination [pageIndex]="2" [total]="50" simple />`
})
export class TriDemoPaginationSimpleComponent {}
