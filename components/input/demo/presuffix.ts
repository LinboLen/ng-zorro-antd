import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TriCascaderModule } from 'ng-zorro-antd/cascader';
import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriInputModule } from 'ng-zorro-antd/input';
import { TriSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'tri-demo-input-presuffix',
  imports: [TriInputModule, TriIconModule, TriSelectModule, TriCascaderModule, FormsModule],
  template: `
    <tri-input-wrapper>
      <tri-icon inputPrefix type="user" />
      <input tri-input placeholder="Enter your username" />
      <tri-icon inputSuffix type="info-circle" />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper prefix="¥" suffix="RMB">
      <input tri-input />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper prefix="¥" suffix="RMB">
      <input tri-input disabled />
    </tri-input-wrapper>
    <br />
    <br />
    <tri-input-wrapper>
      <input tri-input placeholder="input password support suffix" />
      <tri-icon inputSuffix class="tri-input-password-icon" type="eye-invisible" />
      <tri-icon inputSuffix type="lock" />
    </tri-input-wrapper>
  `
})
export class TriDemoInputPresuffixComponent {
  readonly value = signal('mysite');
}
