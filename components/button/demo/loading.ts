import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-demo-button-loading',
  imports: [TriButtonModule, TriIconModule],
  template: `
    <button tri-button type="primary" loading>
      <tri-icon type="poweroff" />
      Loading
    </button>
    <button tri-button type="primary" size="small" loading>Loading</button>
    <br />
    <button tri-button type="primary" [loading]="loadings()[0]" (click)="enterLoading(0)">Click me!</button>
    <button tri-button type="primary" [loading]="loadings()[1]" (click)="enterLoading(1)">
      <tri-icon type="poweroff" />
      Click me!
    </button>
    <br />
    <button tri-button loading shape="circle"></button>
    <button tri-button loading type="primary" shape="circle"></button>
  `,
  styles: `
    [nz-button] {
      margin-right: 8px;
      margin-bottom: 12px;
    }
  `
})
export class TriDemoButtonLoadingComponent {
  readonly loadings = signal<boolean[]>([false, false]);

  enterLoading(index: number): void {
    const update = (index: number, loading: boolean): void => {
      this.loadings.update(loadings => loadings.map((item, i) => (i === index ? loading : item)));
    };

    update(index, true);
    setTimeout(() => update(index, false), 3000);
  }
}
