import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-tag-icon',
  imports: [TriIconModule, TriTagModule],
  template: `
    <tri-tag color="#55acee">
      <tri-icon type="twitter" />
      <span>Twitter</span>
    </tri-tag>
    <tri-tag color="#cd201f">
      <tri-icon type="youtube" />
      <span>Youtube</span>
    </tri-tag>
    <tri-tag color="#3b5999">
      <tri-icon type="facebook" />
      <span>Facebook</span>
    </tri-tag>
    <tri-tag color="#55acee">
      <tri-icon type="linkedin" />
      <span>LinkedIn</span>
    </tri-tag>
  `
})
export class TriDemoTagIconComponent {}
