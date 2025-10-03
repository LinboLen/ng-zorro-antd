import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'tri-demo-input-size',
  imports: [TriInputModule, TriIconModule],
  template: `
    <tri-input-wrapper>
      <tri-icon inputPrefix type="user" />
      <input tri-input placeholder="large size" size="large" />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <tri-icon inputPrefix type="user" />
      <input tri-input placeholder="default size" size="default" />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <tri-icon inputPrefix type="user" />
      <input tri-input placeholder="small size" size="small" />
    </tri-input-wrapper>
  `
})
export class TriDemoInputSizeComponent {}
