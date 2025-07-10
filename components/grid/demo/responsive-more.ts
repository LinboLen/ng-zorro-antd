import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [TriGridModule],
  template: `
    <div tri-row>
      <div tri-col [xs]="{ span: 5, offset: 1 }" [lg]="{ span: 6, offset: 2 }">Col</div>
      <div tri-col [xs]="{ span: 11, offset: 1 }" [lg]="{ span: 6, offset: 2 }">Col</div>
      <div tri-col [xs]="{ span: 5, offset: 1 }" [lg]="{ span: 6, offset: 2 }">Col</div>
    </div>
  `
})
export class TriDemoGridResponsiveMoreComponent {}
