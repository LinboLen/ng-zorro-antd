/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  booleanAttribute,
  inject,
  DestroyRef,
  input,
  output
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'tri-tree-node-checkbox:not([builtin])',
  template: `<span class="tri-tree-checkbox-inner"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-tree-checkbox',
    '[class.tri-tree-checkbox-checked]': `checked()`,
    '[class.tri-tree-checkbox-indeterminate]': `indeterminate()`,
    '[class.tri-tree-checkbox-disabled]': `disabled()`
  }
})
export class TriTreeNodeCheckboxComponent implements OnInit {
  readonly checked = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly click = output<MouseEvent>();

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly elementRef = inject(ElementRef);
  protected readonly ngZone = inject(NgZone);

  ngOnInit(): void {
    fromEventOutsideAngular<MouseEvent>(this.elementRef.nativeElement, 'click')
      .pipe(
        filter(() => !this.disabled()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: MouseEvent) => {
        this.ngZone.run(() => {
          this.click.emit(event);
        });
      });
  }
}
