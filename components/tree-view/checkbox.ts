/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

@Component({
  selector: 'tri-tree-node-checkbox:not([builtin])',
  template: `<span class="tri-tree-checkbox-inner"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-tree-checkbox',
    '[class.tri-tree-checkbox-checked]': `checked`,
    '[class.tri-tree-checkbox-indeterminate]': `indeterminate`,
    '[class.tri-tree-checkbox-disabled]': `disabled`
  }
})
export class TriTreeNodeCheckboxComponent implements OnInit {
  private ngZone = inject(NgZone);
  private ref = inject(ChangeDetectorRef);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private destroyRef = inject(DestroyRef);

  @Input({ transform: booleanAttribute }) checked?: boolean;
  @Input({ transform: booleanAttribute }) indeterminate?: boolean;
  @Input({ transform: booleanAttribute }) disabled?: boolean;
  @Output() readonly click = new EventEmitter<MouseEvent>();

  ngOnInit(): void {
    fromEventOutsideAngular<MouseEvent>(this.el, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (!this.disabled && this.click.observers.length) {
          this.ngZone.run(() => {
            this.click.emit(event);
            this.ref.markForCheck();
          });
        }
      });
  }
}
