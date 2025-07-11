import { Component } from '@angular/core';

import { TriResizableModule, TriResizeDirection, TriResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'tri-demo-resizable-basic',
  imports: [TriResizableModule],
  template: `
    <div
      class="box"
      tri-resizable
      [maxWidth]="600"
      [minWidth]="80"
      [maxHeight]="200"
      [minHeight]="80"
      [disabled]="disabled"
      [style.height.px]="height"
      [style.width.px]="width"
      (resize)="onResize($event)"
    >
      <tri-resize-handles></tri-resize-handles>
      content
    </div>
  `,
  styles: [
    `
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
  ]
})
export class TriDemoResizableBasicComponent {
  width = 400;
  height = 200;
  id = -1;
  disabled = false;
  resizeDirection: TriResizeDirection | null = null;

  onResize({ width, height, direction }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width = width!;
      this.height = height!;
      this.resizeDirection = direction!;
    });
  }
}
