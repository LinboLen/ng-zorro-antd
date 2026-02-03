import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-basic',
  imports: [TriPaginationModule],
  template: `<tri-pagination [pageIndex]="1" [total]="50" />`
})
export class TriDemoPaginationBasicComponent {}
