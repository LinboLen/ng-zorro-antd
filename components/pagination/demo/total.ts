import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-total',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="1" [total]="85" [pageSize]="20" [showTotal]="totalTemplate" />
    <br />
    <tri-pagination [pageIndex]="1" [total]="85" [pageSize]="20" [showTotal]="rangeTemplate" />
    <ng-template #totalTemplate let-total>Total {{ total }} items</ng-template>
    <ng-template #rangeTemplate let-range="range" let-total>
      {{ range[0] }}-{{ range[1] }} of {{ total }} items
    </ng-template>
  `
})
export class TriDemoPaginationTotalComponent {}
