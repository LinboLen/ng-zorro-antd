import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'tri-demo-skeleton-children',
  imports: [TriButtonModule, TriSkeletonModule],
  template: `
    <div class="article">
      <tri-skeleton [loading]="loading">
        <h4>Ant Design, a design language</h4>
        <p>
          We supply a series of design principles, practical patterns and high quality design resources (Sketch and
          Axure), to help people create their product prototypes beautifully and efficiently.
        </p>
      </tri-skeleton>
      <button tri-button (click)="showSkeleton()" [disabled]="loading">Show Skeleton</button>
    </div>
  `,
  styles: [
    `
      .article h4 {
        margin-bottom: 16px;
      }
      .article button {
        margin-top: 16px;
      }
    `
  ]
})
export class TriDemoSkeletonChildrenComponent {
  loading = false;

  showSkeleton(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }
}
