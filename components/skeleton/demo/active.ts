import { Component } from '@angular/core';

import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'tri-demo-skeleton-active',
  imports: [TriSkeletonModule],
  template: `<tri-skeleton [active]="true"></tri-skeleton>`
})
export class TriDemoSkeletonActiveComponent {}
