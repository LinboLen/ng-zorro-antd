import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [TriGridModule],
  template: `
    <div tri-row>
      <div tri-col span="8">col-8</div>
      <div tri-col span="8" offset="8">col-8</div>
    </div>
    <div tri-row>
      <div tri-col span="6" offset="6">col-6 col-offset-6</div>
      <div tri-col span="6" offset="6">col-6 col-offset-6</div>
    </div>
    <div tri-row>
      <div tri-col span="12" offset="6">col-12 col-offset-6</div>
    </div>
  `
})
export class TriDemoGridOffsetComponent {}
