import { Component, inject } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriImageModule, TriImageService } from 'ng-zorro-antd/image';

@Component({
  selector: 'tri-demo-image-service',
  imports: [TriButtonModule, TriImageModule],
  template: `<button tri-button type="primary" (click)="onClick()">Preview</button>`
})
export class TriDemoImageServiceComponent {
  private imageService = inject(TriImageService);
  readonly images = [
    {
      src: 'https://img.alicdn.com/tfs/TB1g.mWZAL0gK0jSZFtXXXQCXXa-200-200.svg',
      width: '200px',
      height: '200px',
      alt: 'ng-zorro'
    },
    {
      src: 'https://img.alicdn.com/tfs/TB1Z0PywTtYBeNjy1XdXXXXyVXa-186-200.svg',
      width: '200px',
      height: '200px',
      alt: 'angular'
    }
  ];

  onClick(): void {
    this.imageService.preview(this.images, { zoom: 1.5, rotate: 0 });
  }
}
