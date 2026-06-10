import { Component, signal } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSegmentedModule } from 'ng-zorro-antd/segmented';

const defaultOptions = ['Daily', 'Weekly', 'Monthly'];

@Component({
  selector: 'tri-demo-segmented-dynamic',
  imports: [TriButtonModule, TriSegmentedModule],
  template: `
    <tri-segmented [options]="options()" />
    <br />
    <button tri-button type="primary" [disabled]="moreLoaded()" (click)="handleLoadMore()"> Load more options </button>
  `,
  styles: `
    .ant-segmented {
      margin-bottom: 10px;
    }
  `
})
export class TriDemoSegmentedDynamicComponent {
  readonly options = signal([...defaultOptions]);

  readonly moreLoaded = signal(false);

  handleLoadMore(): void {
    this.moreLoaded.set(true);
    this.options.set([...defaultOptions, 'Quarterly', 'Yearly']);
  }
}
