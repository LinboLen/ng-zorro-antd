/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriResizableService } from './resizable.service';

export type TriCursorType = 'window' | 'grid';

export type TriResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

export class TriResizeHandleMouseDownEvent {
  constructor(
    public direction: TriResizeDirection,
    public mouseEvent: MouseEvent | TouchEvent
  ) {}
}

const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true }) as AddEventListenerOptions;

@Component({
  selector: 'tri-resize-handle,[tri-resize-handle]',
  exportAs: 'triResizeHandle',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nz-resizable-handle',
    '[class.nz-resizable-handle-top]': `nzDirection === 'top'`,
    '[class.nz-resizable-handle-right]': `nzDirection === 'right'`,
    '[class.nz-resizable-handle-bottom]': `nzDirection === 'bottom'`,
    '[class.nz-resizable-handle-left]': `nzDirection === 'left'`,
    '[class.nz-resizable-handle-topRight]': `nzDirection === 'topRight'`,
    '[class.nz-resizable-handle-bottomRight]': `nzDirection === 'bottomRight'`,
    '[class.nz-resizable-handle-bottomLeft]': `nzDirection === 'bottomLeft'`,
    '[class.nz-resizable-handle-topLeft]': `nzDirection === 'topLeft'`,
    '[class.nz-resizable-handle-cursor-type-grid]': `nzCursorType === 'grid'`,
    '[class.nz-resizable-handle-cursor-type-window]': `nzCursorType === 'window'`,
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerup)': 'onPointerUp($event)'
  }
})
export class TriResizeHandleComponent implements OnInit {
  private readonly resizableService = inject(TriResizableService);
  private readonly renderer = inject(Renderer2);
  private readonly el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);

  @Input() direction: TriResizeDirection = 'bottomRight';
  @Input() cursorType: TriCursorType = 'window';
  @Output() readonly mouseDown = new EventEmitter<TriResizeHandleMouseDownEvent>();

  ngOnInit(): void {
    this.resizableService.mouseEnteredOutsideAngular$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(entered => {
      if (entered) {
        this.renderer.addClass(this.el, 'nz-resizable-handle-box-hover');
      } else {
        this.renderer.removeClass(this.el, 'nz-resizable-handle-box-hover');
      }
    });

    // Note: since Chrome 56 defaults document level `touchstart` listener to passive.
    // The element `touchstart` listener is not passive by default
    // We never call `preventDefault()` on it, so we're safe making it passive too.
    merge(
      fromEventOutsideAngular<MouseEvent>(this.el, 'mousedown', passiveEventListenerOptions),
      fromEventOutsideAngular<TouchEvent>(this.el, 'touchstart', passiveEventListenerOptions)
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        this.resizableService.handleMouseDownOutsideAngular$.next(
          new TriResizeHandleMouseDownEvent(this.direction, event)
        );
      });
  }

  onPointerDown(event: PointerEvent): void {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  onPointerUp(event: PointerEvent): void {
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
  }
}
