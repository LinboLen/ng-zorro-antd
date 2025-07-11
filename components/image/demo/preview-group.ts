import { Component } from '@angular/core';

import { TriImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'tri-demo-image-preview-group',
  imports: [TriImageModule],
  template: `
    <tri-image-group>
      <img tri-image width="200px" src="https://img.alicdn.com/tfs/TB1g.mWZAL0gK0jSZFtXXXQCXXa-200-200.svg" alt="" />
      <img tri-image width="200px" src="https://img.alicdn.com/tfs/TB1Z0PywTtYBeNjy1XdXXXXyVXa-186-200.svg" alt="" />
    </tri-image-group>
  `
})
export class TriDemoImagePreviewGroupComponent {}
