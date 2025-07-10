import { Component } from '@angular/core';

import { TriLayoutModule } from 'ng-zorro-antd/layout';
import { TriResizableModule, TriResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: '',
  imports: [TriLayoutModule, TriResizableModule],
  template: `
    <tri-layout>
      <tri-header>Header</tri-header>
      <tri-layout>
        <tri-sider
          [width]="siderWidth"
          tri-resizable
          [minWidth]="50"
          [maxWidth]="300"
          (resize)="onSideResize($event)"
        >
          <tri-resize-handle direction="right" cursorType="grid">
            <div class="sider-resize-line"></div>
          </tri-resize-handle>
          Sider
        </tri-sider>
        <tri-content>
          <div
            tri-resizable
            class="resizable-box"
            [style.height.px]="contentHeight"
            [maxHeight]="300"
            [minHeight]="50"
            (resize)="onContentResize($event)"
          >
            <tri-resize-handle direction="bottom" cursorType="grid">
              <div class="content-resize-line"></div>
            </tri-resize-handle>
            Content 1
          </div>
          <div>Content 2</div>
        </tri-content>
      </tri-layout>
    </tri-layout>
  `,
  styles: [
    `
      nz-header {
        background: #7dbcea;
        color: #fff;
      }
      nz-sider {
        background: #3ba0e9;
        color: #fff;
      }

      nz-sider.nz-resizable-resizing {
        transition: none;
      }

      nz-content {
        display: flex;
        flex-direction: column;
        background: rgba(16, 142, 233, 1);
        height: 350px;
        color: #fff;
      }

      nz-content > div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }

      nz-content .resizable-box {
        flex: none;
      }

      nz-content,
      nz-header,
      ::ng-deep nz-sider > .ant-layout-sider-children {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sider-resize-line {
        height: 100%;
        width: 5px;
        border-right: 1px solid #e8e8e8;
      }

      .content-resize-line {
        width: 100%;
        height: 5px;
        border-bottom: 1px solid #e8e8e8;
      }
    `
  ]
})
export class TriDemoResizableLayoutComponent {
  siderWidth = 120;
  contentHeight = 200;
  id = -1;

  onSideResize({ width }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.siderWidth = width!;
    });
  }

  onContentResize({ height }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.contentHeight = height!;
    });
  }
}
