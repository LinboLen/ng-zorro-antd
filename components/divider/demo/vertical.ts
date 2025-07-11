import { Component } from '@angular/core';

import { TriDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'tri-demo-divider-vertical',
  imports: [TriDividerModule],
  template: `
    <div>
      Text
      <tri-divider type="vertical"></tri-divider>
      <a href="#">Link</a>
      <tri-divider type="vertical"></tri-divider>
      <a href="#">Link</a>
    </div>
  `
})
export class TriDemoDividerVerticalComponent {}
