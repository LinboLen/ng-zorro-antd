/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { Directive, ElementRef, inject } from '@angular/core';

import { TriSafeAny } from 'ng-zorro-antd/core/types';

/**
 * A patch directive to select the element of a component.
 */
@Directive({
  selector: '',
  exportAs: 'triElement'
})
export class TriElementPatchDirective {
  public elementRef = inject(ElementRef<HTMLElement>);
  get nativeElement(): TriSafeAny {
    return this.elementRef.nativeElement;
  }
}
