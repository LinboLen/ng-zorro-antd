/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef, inject, Input, OnChanges, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '',
  host: {
    '[class.tri-table-cell-fix-right]': `isFixedRight`,
    '[class.tri-table-cell-fix-left]': `isFixedLeft`,
    '[style.position]': `isFixed? 'sticky' : null`
  }
})
export class TriCellFixedDirective implements OnChanges {
  private renderer = inject(Renderer2);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;

  @Input() right: string | boolean = false;
  @Input() left: string | boolean = false;
  @Input() colspan: number | null = null;
  @Input() colSpan: number | null = null;
  changes$ = new Subject<void>();
  isAutoLeft = false;
  isAutoRight = false;
  isFixedLeft = false;
  isFixedRight = false;
  isFixed = false;

  setAutoLeftWidth(autoLeft: string | null): void {
    this.renderer.setStyle(this.el, 'left', autoLeft);
  }

  setAutoRightWidth(autoRight: string | null): void {
    this.renderer.setStyle(this.el, 'right', autoRight);
  }

  setIsFirstRight(isFirstRight: boolean): void {
    this.setFixClass(isFirstRight, 'ant-table-cell-fix-right-first');
  }

  setIsLastLeft(isLastLeft: boolean): void {
    this.setFixClass(isLastLeft, 'ant-table-cell-fix-left-last');
  }

  private setFixClass(flag: boolean, className: string): void {
    // the setFixClass function may call many times, so remove it first.
    this.renderer.removeClass(this.el, className);

    if (flag) {
      this.renderer.addClass(this.el, className);
    }
  }

  ngOnChanges(): void {
    this.setIsFirstRight(false);
    this.setIsLastLeft(false);
    this.isAutoLeft = this.left === '' || this.left === true;
    this.isAutoRight = this.right === '' || this.right === true;
    this.isFixedLeft = this.left !== false;
    this.isFixedRight = this.right !== false;
    this.isFixed = this.isFixedLeft || this.isFixedRight;
    const validatePx = (value: string | boolean): string | null => {
      if (typeof value === 'string' && value !== '') {
        return value;
      } else {
        return null;
      }
    };
    this.setAutoLeftWidth(validatePx(this.left));
    this.setAutoRightWidth(validatePx(this.right));
    this.changes$.next();
  }
}
