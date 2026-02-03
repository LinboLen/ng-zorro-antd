import { Component } from '@angular/core';

import { TriGridModule } from 'ng-zorro-antd/grid';
import { TriResizableModule, TriResizeEvent, TriResizeHandleOption } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'tri-demo-resizable-grid',
  imports: [TriGridModule, TriResizableModule],
  template: `
    <div tri-row>
      <div
        class="col"
        tri-col
        tri-resizable
        (resize)="onResize($event)"
        [minColumn]="3"
        [maxColumn]="20"
        [gridColumnCount]="24"
        [span]="col"
      >
        <tri-resize-handles [directions]="directions" />
        col-{{ col }}
      </div>
      <div class="col right" tri-col [span]="24 - col">col-{{ 24 - col }}</div>
    </div>
  `,
  styles: `
    .col {
      padding: 16px 0;
      text-align: center;
      border-radius: 0;
      min-height: 30px;
      margin-top: 8px;
      margin-bottom: 8px;
      background: rgba(0, 160, 233, 0.7);
      color: #fff;
    }

    .col.right {
      background: #00a0e9;
    }
  `
})
export class TriDemoResizableGridComponent {
  col = 8;
  id = -1;
  directions: TriResizeHandleOption[] = [
    {
      direction: 'right',
      cursorType: 'grid'
    }
  ];

  onResize({ col }: TriResizeEvent): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.col = col!;
    });
  }
}
