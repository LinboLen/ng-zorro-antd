import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [TriGridModule],
  template: `
    <div tri-row>
      <div tri-col xs="2" sm="4" md="6" lg="8" xl="10">Col</div>
      <div tri-col xs="20" sm="16" md="12" lg="8" xl="4">Col</div>
      <div tri-col xs="2" sm="4" md="6" lg="8" xl="10">Col</div>
    </div>
  `
})
export class TriDemoGridResponsiveComponent {}
