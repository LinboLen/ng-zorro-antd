import { Component } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-search-input-loading',
  imports: [TriInputModule],
  template: `
    <tri-input-search loading>
      <input tri-input placeholder="input search loading default" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search loading enterButton>
      <input tri-input placeholder="input search loading with enterButton" />
    </tri-input-search>
    <br />
    <br />
    <tri-input-search loading enterButton="Search">
      <input tri-input placeholder="input search text" size="large" />
    </tri-input-search>
  `
})
export class TriDemoInputSearchInputLoadingComponent {}
