/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { DestroyRef, Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriTableDataService } from '../table-data.service';

@Directive({
  selector: ''
})
export class TriCustomColumnDirective<T> implements OnInit {
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private renderer = inject(Renderer2);
  private tableDataService = inject(TriTableDataService<T>);
  private destroyRef = inject(DestroyRef);

  @Input() cellControl: string | null = null;

  ngOnInit(): void {
    this.tableDataService.listOfCustomColumn$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(item => {
      item.forEach((v, i) => {
        if (v.value === this.cellControl) {
          this.renderer.setStyle(this.el, 'display', v.default ? 'block' : 'none');
          this.renderer.setStyle(this.el, 'order', i);
          this.renderer.setStyle(this.el, 'flex', v.fixWidth ? `1 0 ${v.width}px` : `1 1 ${v.width}px`);
        }
      });
    });
  }
}
