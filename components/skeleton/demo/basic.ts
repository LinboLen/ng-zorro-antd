import { Component } from '@angular/core';

import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'tri-demo-skeleton-basic',
  imports: [TriSkeletonModule],
  template: `<tri-skeleton />`
})
export class TriDemoSkeletonBasicComponent {}
