import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

import { TriTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'tri-demo-tag-draggable',
  imports: [CdkDropList, CdkDrag, TriTagModule],
  template: `
    <div class="tag-list" cdkDropList cdkDropListOrientation="mixed" (cdkDropListDropped)="drop($event)">
      @for (tag of tags; track tag) {
        <tri-tag cdkDrag>{{ tag }}</tri-tag>
      }
    </div>
  `,
  styles: `
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tag-list nz-tag {
      margin-inline-end: 0;
      cursor: move;
    }

    .tag-list .cdk-drag-placeholder {
      opacity: 0;
    }
  `
})
export class TriDemoTagDraggableComponent {
  tags = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tags, event.previousIndex, event.currentIndex);
  }
}
