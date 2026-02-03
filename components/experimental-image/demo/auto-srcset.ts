import { Component } from '@angular/core';

import { createAliObjectsLoader, TriImageModule as NzExperimentalImageModule } from 'ng-zorro-antd/experimental/image';
import { TriImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'tri-demo-experimental-image-auto-srcset',
  imports: [TriImageModule, NzExperimentalImageModule],
  template: `<tri-image [src]="src" width="200" height="200" [srcLoader]="loader" autoSrcset />`
})
export class TriDemoExperimentalImageAutoSrcsetComponent {
  src = 'jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
  loader = createAliObjectsLoader('https://zos.alipayobjects.com/rmsportal');
}
