import { Component } from '@angular/core';

import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: '',
  imports: [TriSkeletonModule],
  template: `<tri-skeleton [avatar]="true" [paragraph]="{ rows: 4 }"></tri-skeleton>`
})
export class TriDemoSkeletonComplexComponent {}
