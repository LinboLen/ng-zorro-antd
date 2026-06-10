import { Component, signal } from '@angular/core';

import { TriResizableModule, TriResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'tri-demo-resizable-lock-aspect-ratio',
  imports: [TriResizableModule],
  template: `
    <div
      class="box"
      tri-resizable
      lockAspectRatio
      (resize)="onResize($event)"
      [style.height.px]="height()"
      [style.width.px]="width()"
    >
      <tri-resize-handles />
      content
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 200px;
    }
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eee;
      border: 1px solid #ddd;
    }
  `
})
export class TriDemoResizableLockAspectRatioComponent {
  readonly width = signal(400);
  readonly height = signal(200);
  id = -1;

  onResize({ width, height }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width.set(width!);
      this.height.set(height!);
    });
  }
}
