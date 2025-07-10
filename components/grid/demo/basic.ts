import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: '',
  imports: [TriGridModule],
  template: `
    <div tri-row>
      <div tri-col span="12">col-12</div>
      <div tri-col span="12">col-12</div>
    </div>
    <div tri-row>
      <div tri-col span="8">col-8</div>
      <div tri-col span="8">col-8</div>
      <div tri-col span="8">col-8</div>
    </div>
    <div tri-row>
      <div tri-col span="6">col-6</div>
      <div tri-col span="6">col-6</div>
      <div tri-col span="6">col-6</div>
      <div tri-col span="6">col-6</div>
    </div>
  `
})
export class TriDemoGridBasicComponent {}
