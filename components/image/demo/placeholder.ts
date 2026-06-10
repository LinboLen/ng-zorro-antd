import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriImageModule } from 'ng-zorro-antd/image';
import { TriSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'tri-demo-image-placeholder',
  imports: [TriButtonModule, TriImageModule, TriSpaceModule],
  template: `
    <tri-space [size]="12">
      <img *spaceItem tri-image width="200px" height="200px" [src]="src()" [placeholder]="placeholder" />
      <button *spaceItem tri-button type="primary" (click)="onReload()">Reload</button>
    </tri-space>
  `
})
export class TriDemoImagePlaceholderComponent {
  readonly src = signal('https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png');
  readonly placeholder =
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200';

  onReload(): void {
    this.src.set(`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${new Date()}`);
  }
}
