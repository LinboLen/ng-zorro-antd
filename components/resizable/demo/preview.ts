import { Component, signal } from '@angular/core';

import { TriResizableModule, TriResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'tri-demo-resizable-preview',
  imports: [TriResizableModule],
  template: `
    <div
      class="box"
      tri-resizable
      preview
      (resizeEnd)="onResize($event)"
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
export class TriDemoResizablePreviewComponent {
  readonly width = signal(400);
  readonly height = signal(200);

  onResize({ width, height }: TriResizeEvent): void {
    this.width.set(width!);
    this.height.set(height!);
  }
}
