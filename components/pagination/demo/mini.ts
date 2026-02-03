import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-mini',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [(pageIndexChange)]="current" [total]="50" size="small" />
    <br />
    <tri-pagination [(pageIndexChange)]="current" [total]="50" size="small" showSizeChanger showQuickJumper />
    <br />
    <tri-pagination [(pageIndexChange)]="current" [total]="50" size="small" [showTotal]="totalTemplate" />
    <ng-template #totalTemplate let-total>Total {{ total }} items</ng-template>
  `
})
export class TriDemoPaginationMiniComponent {
  current = 1;
}
