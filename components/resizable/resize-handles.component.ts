/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TriCursorType, TriResizeDirection, TriResizeHandleComponent } from './resize-handle.component';

export const DEFAULT_RESIZE_DIRECTION: TriResizeDirection[] = [
  'bottomRight',
  'topRight',
  'bottomLeft',
  'topLeft',
  'bottom',
  'right',
  'top',
  'left'
];

export interface TriResizeHandleOption {
  direction: TriResizeDirection;
  cursorType: TriCursorType;
}

function normalizeResizeHandleOptions(value: Array<TriResizeDirection | TriResizeHandleOption>): TriResizeHandleOption[] {
  return value.map(val => {
    if (typeof val === 'string') {
      return {
        direction: val,
        cursorType: 'window'
      };
    }

    return val;
  });
}

@Component({
  selector: '',
  exportAs: 'triResizeHandles',
  template: `
    @for (option of resizeHandleOptions; track option) {
      <tri-resize-handle [direction]="option.direction" [cursorType]="option.cursorType" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TriResizeHandleComponent]
})
export class TriResizeHandlesComponent implements OnChanges {
  @Input() directions: Array<TriResizeDirection | TriResizeHandleOption> = DEFAULT_RESIZE_DIRECTION;

  resizeHandleOptions = normalizeResizeHandleOptions(this.directions);

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDirections } = changes;
    if (nzDirections) {
      this.resizeHandleOptions = normalizeResizeHandleOptions(nzDirections.currentValue);
    }
  }
}
