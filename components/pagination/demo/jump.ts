import { Component } from '@angular/core';

import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: '',
  imports: [TriPaginationModule],
  template: `
    <tri-pagination [pageIndex]="2" [total]="500" showQuickJumper></tri-pagination>
    <br />
    <tri-pagination [pageIndex]="2" [total]="500" showQuickJumper disabled></tri-pagination>
  `
})
export class TriDemoPaginationJumpComponent {}
