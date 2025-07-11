import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-controlled',
  imports: [TriPaginationModule],
  template: `<tri-pagination [pageIndex]="3" [total]="50"></tri-pagination>`
})
export class TriDemoPaginationControlledComponent {}
