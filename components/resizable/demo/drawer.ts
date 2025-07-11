import { Component } from '@angular/core';

import { TriButtonModule } from 'ng-zorro-antd/button';
import { TriDrawerModule } from 'ng-zorro-antd/drawer';
import { TriResizableModule, TriResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'tri-demo-resizable-drawer',
  imports: [TriButtonModule, TriDrawerModule, TriResizableModule],
  template: `
    <button tri-button type="primary" (click)="open()">Open</button>
    <tri-drawer
      [closable]="false"
      [visible]="visible"
      [bodyStyle]="{
        padding: 0,
        height: 'calc(100vh - 55px)'
      }"
      [width]="width"
      placement="left"
      title="Resizable Drawer"
      (onClose)="close()"
    >
      <ng-container *drawerContent>
        @if (visible) {
          <div class="drawer-body" tri-resizable bounds="window" [minWidth]="256" (resize)="onResize($event)">
            <tri-resize-handles [directions]="['right']" />
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </div>
        }
      </ng-container>
    </tri-drawer>
  `,
  styles: [
    `
      .drawer-body {
        width: 100%;
        height: 100%;
        padding: 24px;
      }
    `
  ]
})
export class TriDemoResizableDrawerComponent {
  width = 256;
  visible = false;
  id = -1;

  onResize({ width }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.width = width!;
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
