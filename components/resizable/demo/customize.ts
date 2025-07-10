import { Component } from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';
import { TriResizableModule, TriResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: '',
  imports: [TriIconModule, TriResizableModule],
  template: `
    <div class="box" tri-resizable (resize)="onResize($event)" [style.height.px]="height" [style.width.px]="width">
      content
      <tri-resize-handle direction="bottomRight">
        <tri-icon class="bottom-right" type="caret-up" theme="outline" [rotate]="135" />
      </tri-resize-handle>
      <tri-resize-handle direction="right">
        <div class="right-wrap">
          <tri-icon class="right" type="more" theme="outline" />
        </div>
      </tri-resize-handle>
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

      .bottom-right {
        position: absolute;
        top: 0;
        left: 0;
      }

      .right-wrap {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .right {
        background: #fff;
        border: 1px solid #ddd;
        text-align: center;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
      }
    `
  ]
})
export class TriDemoResizableCustomizeComponent {
  width = 400;
  height = 200;
  id = -1;

  onResize({ width, height }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width = width!;
      this.height = height!;
    });
  }
}
