/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  booleanAttribute,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  numberAttribute,
  OnDestroy,
  Output,
  Renderer2
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { ensureInBounds, fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { getEventWithPoint } from './resizable-utils';
import { TriResizableService } from './resizable.service';
import { TriResizeDirection, TriResizeHandleMouseDownEvent } from './resize-handle.component';

export interface TriResizeEvent {
  width?: number;
  height?: number;
  col?: number;
  mouseEvent?: MouseEvent | TouchEvent;
  direction?: TriResizeDirection;
}

@Directive({
  selector: '',
  exportAs: 'triResizable',
  providers: [TriResizableService],
  host: {
    class: 'nz-resizable',
    '[class.nz-resizable-resizing]': 'resizing',
    '[class.nz-resizable-disabled]': 'nzDisabled'
  }
})
export class TriResizableDirective implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly resizableService = inject(TriResizableService);
  private readonly platform = inject(Platform);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  @Input() bounds: 'window' | 'parent' | ElementRef<HTMLElement> = 'parent';
  @Input() maxHeight?: number;
  @Input() maxWidth?: number;
  @Input({ transform: numberAttribute }) minHeight: number = 40;
  @Input({ transform: numberAttribute }) minWidth: number = 40;
  @Input({ transform: numberAttribute }) gridColumnCount: number = -1;
  @Input({ transform: numberAttribute }) maxColumn: number = -1;
  @Input({ transform: numberAttribute }) minColumn: number = -1;
  @Input({ transform: booleanAttribute }) lockAspectRatio: boolean = false;
  @Input({ transform: booleanAttribute }) preview: boolean = false;
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Output() readonly resize = new EventEmitter<TriResizeEvent>();
  @Output() readonly resizeEnd = new EventEmitter<TriResizeEvent>();
  @Output() readonly resizeStart = new EventEmitter<TriResizeEvent>();

  resizing = false;
  private elRect!: DOMRect;
  private currentHandleEvent: TriResizeHandleMouseDownEvent | null = null;
  private ghostElement: HTMLDivElement | null = null;
  private el!: HTMLElement;
  private sizeCache: TriResizeEvent | null = null;

  constructor() {
    this.resizableService.handleMouseDownOutsideAngular$.pipe(takeUntilDestroyed()).subscribe(event => {
      if (this.disabled) {
        return;
      }
      this.resizing = true;
      this.resizableService.startResizing(event.mouseEvent);
      this.currentHandleEvent = event;
      if (this.resizeStart.observers.length) {
        this.ngZone.run(() => this.resizeStart.emit({ mouseEvent: event.mouseEvent, direction: event.direction }));
      }
      this.elRect = this.el.getBoundingClientRect();
    });

    this.resizableService.documentMouseUpOutsideAngular$
      .pipe(takeUntilDestroyed(), filter(Boolean))
      .subscribe(event => {
        if (this.resizing) {
          this.resizing = false;
          this.resizableService.documentMouseUpOutsideAngular$.next(null);
          this.endResize(event);
        }
      });

    this.resizableService.documentMouseMoveOutsideAngular$.pipe(takeUntilDestroyed()).subscribe(event => {
      if (this.resizing) {
        this._resize(event);
      }
    });
  }

  setPosition(): void {
    const position = getComputedStyle(this.el).position;
    if (position === 'static' || !position) {
      this.renderer.setStyle(this.el, 'position', 'relative');
    }
  }

  calcSize(width: number, height: number, ratio: number): TriResizeEvent {
    let newWidth: number;
    let newHeight: number;
    let maxWidth: number;
    let maxHeight: number;
    let col = 0;
    let spanWidth = 0;
    let minWidth = this.minWidth;
    let boundWidth = Infinity;
    let boundHeight = Infinity;
    if (this.bounds === 'parent') {
      const parent = this.renderer.parentNode(this.el);
      if (parent instanceof HTMLElement) {
        const parentRect = parent.getBoundingClientRect();
        boundWidth = parentRect.width;
        boundHeight = parentRect.height;
      }
    } else if (this.bounds === 'window') {
      if (typeof window !== 'undefined') {
        boundWidth = window.innerWidth;
        boundHeight = window.innerHeight;
      }
    } else if (this.bounds && this.bounds.nativeElement && this.bounds.nativeElement instanceof HTMLElement) {
      const boundsRect = this.bounds.nativeElement.getBoundingClientRect();
      boundWidth = boundsRect.width;
      boundHeight = boundsRect.height;
    }

    maxWidth = ensureInBounds(this.maxWidth!, boundWidth);
    // eslint-disable-next-line prefer-const
    maxHeight = ensureInBounds(this.maxHeight!, boundHeight);

    if (this.gridColumnCount !== -1) {
      spanWidth = maxWidth / this.gridColumnCount;
      minWidth = this.minColumn !== -1 ? spanWidth * this.minColumn : minWidth;
      maxWidth = this.maxColumn !== -1 ? spanWidth * this.maxColumn : maxWidth;
    }

    if (ratio !== -1) {
      if (/(left|right)/i.test(this.currentHandleEvent!.direction)) {
        newWidth = Math.min(Math.max(width, minWidth), maxWidth);
        newHeight = Math.min(Math.max(newWidth / ratio, this.minHeight), maxHeight);
        if (newHeight >= maxHeight || newHeight <= this.minHeight) {
          newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
        }
      } else {
        newHeight = Math.min(Math.max(height, this.minHeight), maxHeight);
        newWidth = Math.min(Math.max(newHeight * ratio, minWidth), maxWidth);
        if (newWidth >= maxWidth || newWidth <= minWidth) {
          newHeight = Math.min(Math.max(newWidth / ratio, this.minHeight), maxHeight);
        }
      }
    } else {
      newWidth = Math.min(Math.max(width, minWidth), maxWidth);
      newHeight = Math.min(Math.max(height, this.minHeight), maxHeight);
    }

    if (this.gridColumnCount !== -1) {
      col = Math.round(newWidth / spanWidth);
      newWidth = col * spanWidth;
    }

    return {
      col,
      width: newWidth,
      height: newHeight
    };
  }

  _resize(event: MouseEvent | TouchEvent): void {
    const elRect = this.elRect;
    const resizeEvent = getEventWithPoint(event);
    const handleEvent = getEventWithPoint(this.currentHandleEvent!.mouseEvent);
    let width = elRect.width;
    let height = elRect.height;
    const ratio = this.lockAspectRatio ? width / height : -1;
    switch (this.currentHandleEvent!.direction) {
      case 'bottomRight':
        width = resizeEvent.clientX - elRect.left;
        height = resizeEvent.clientY - elRect.top;
        break;
      case 'bottomLeft':
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
        height = resizeEvent.clientY - elRect.top;
        break;
      case 'topRight':
        width = resizeEvent.clientX - elRect.left;
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case 'topLeft':
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case 'top':
        height = elRect.height + handleEvent.clientY - resizeEvent.clientY;
        break;
      case 'right':
        width = resizeEvent.clientX - elRect.left;
        break;
      case 'bottom':
        height = resizeEvent.clientY - elRect.top;
        break;
      case 'left':
        width = elRect.width + handleEvent.clientX - resizeEvent.clientX;
    }
    const size = this.calcSize(width, height, ratio);
    this.sizeCache = { ...size };
    // Re-enter the Angular zone and run the change detection only if there are any `nzResize` listeners,
    // e.g.: `<div nz-resizable (nzResize)="..."></div>`.
    if (this.resize.observers.length) {
      this.ngZone.run(() => {
        this.resize.emit({
          ...size,
          mouseEvent: event,
          direction: this.currentHandleEvent!.direction
        });
      });
    }
    if (this.preview) {
      this.previewResize(size);
    }
  }

  endResize(event: MouseEvent | TouchEvent): void {
    this.removeGhostElement();
    const size = this.sizeCache
      ? { ...this.sizeCache }
      : {
          width: this.elRect.width,
          height: this.elRect.height
        };
    // Re-enter the Angular zone and run the change detection only if there are any `nzResizeEnd` listeners,
    // e.g.: `<div nz-resizable (nzResizeEnd)="..."></div>`.
    if (this.resizeEnd.observers.length) {
      this.ngZone.run(() => {
        this.resizeEnd.emit({
          ...size,
          mouseEvent: event,
          direction: this.currentHandleEvent!.direction
        });
      });
    }
    this.sizeCache = null;
    this.currentHandleEvent = null;
  }

  previewResize({ width, height }: TriResizeEvent): void {
    this.createGhostElement();
    this.renderer.setStyle(this.ghostElement, 'width', `${width}px`);
    this.renderer.setStyle(this.ghostElement, 'height', `${height}px`);
  }

  createGhostElement(): void {
    if (!this.ghostElement) {
      this.ghostElement = this.renderer.createElement('div');
      this.renderer.setAttribute(this.ghostElement, 'class', 'nz-resizable-preview');
    }
    this.renderer.appendChild(this.el, this.ghostElement);
  }

  removeGhostElement(): void {
    if (this.ghostElement) {
      this.renderer.removeChild(this.el, this.ghostElement);
    }
  }

  ngAfterViewInit(): void {
    if (!this.platform.isBrowser) {
      return;
    }

    this.el = this.elementRef.nativeElement;
    this.setPosition();

    fromEventOutsideAngular(this.el, 'mouseenter')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resizableService.mouseEnteredOutsideAngular$.next(true);
      });

    fromEventOutsideAngular(this.el, 'mouseleave')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resizableService.mouseEnteredOutsideAngular$.next(false);
      });
  }

  ngOnDestroy(): void {
    this.ghostElement = null;
    this.sizeCache = null;
  }
}
