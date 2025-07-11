import { Component } from '@angular/core';

import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-size',
  imports: [TriInputModule],
  template: `
    <input tri-input placeholder="large size" size="large" />
    <br />
    <br />
    <input tri-input placeholder="default size" size="default" />
    <br />
    <br />
    <input tri-input placeholder="small size" size="small" />
  `
})
export class TriDemoInputSizeComponent {}
