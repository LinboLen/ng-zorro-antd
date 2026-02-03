import { Component } from '@angular/core';

import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'tri-demo-skeleton-complex',
  imports: [TriSkeletonModule],
  template: `<tri-skeleton [avatar]="true" [paragraph]="{ rows: 4 }" />`
})
export class TriDemoSkeletonComplexComponent {}
