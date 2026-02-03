import { Component } from '@angular/core';

import { TriImageModule as NzExperimentalImageModule } from 'ng-zorro-antd/experimental/image';
import { TriImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'tri-demo-experimental-image-preloading',
  imports: [TriImageModule, NzExperimentalImageModule],
  template: `<tri-image [src]="src" width="200" height="200" priority />`
})
export class TriDemoExperimentalImagePreloadingComponent {
  src = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
}
