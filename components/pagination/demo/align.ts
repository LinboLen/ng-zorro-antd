import { Component } from '@angular/core';

import { TriFlexModule } from 'ng-zorro-antd/flex';
import { TriPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'tri-demo-pagination-align',
  imports: [TriPaginationModule, TriFlexModule],
  template: `
    <div tri-flex vertical gap="2rem">
      <tri-pagination [pageIndex]="1" [total]="50" align="start" />
      <tri-pagination [pageIndex]="1" [total]="50" align="center" />
      <tri-pagination [pageIndex]="1" [total]="50" align="end" />
    </div>
  `
})
export class TriDemoPaginationAlignComponent {}
