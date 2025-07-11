/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { AfterViewInit, Directive, ElementRef, inject, Input, OnChanges, Renderer2 } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

/**
 * hack the bug
 * angular router change with unexpected transition trigger after calling applicationRef.attachView
 * https://github.com/angular/angular/issues/34718
 */
@Directive({
  selector:
    '[tri-button],[tri-icon],tri-icon,[tri-menu-item],[tri-submenu],tri-select-top-control,tri-select-placeholder,tri-input-group'
})
export class TriTransitionPatchDirective implements AfterViewInit, OnChanges {
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  @Input() hidden: TriSafeAny = null;
  setHiddenAttribute(): void {
    if (this.hidden) {
      if (typeof this.hidden === 'string') {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', this.hidden);
      } else {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', '');
      }
    } else {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'hidden');
    }
  }

  constructor() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', '');
  }

  ngOnChanges(): void {
    this.setHiddenAttribute();
  }

  ngAfterViewInit(): void {
    this.setHiddenAttribute();
  }
}
