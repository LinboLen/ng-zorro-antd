import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-item-render',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="1" [total]="500" [itemRender]="renderItemTemplate" />
    <ng-template #renderItemTemplate let-type let-page="page">
      @switch (type) {
        @case ('page') {
          <a>{{ page }}</a>
        }
        @case ('prev') {
          <a>Previous</a>
        }
        @case ('next') {
          <a>Next</a>
        }
        @case ('prev_5') {
          <a><<</a>
        }
        @case ('next_5') {
          <a>>></a>
        }
      }
    </ng-template>
  `
})
export class TriDemoPaginationItemRenderComponent {}
