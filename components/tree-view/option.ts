/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  booleanAttribute,
  inject,
  DestroyRef,
  input,
  output,
  effect
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriTreeNodeComponent } from './node';

@Component({
  selector: 'tri-tree-node-option',
  template: `<span class="tri-tree-title"><ng-content /></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-tree-node-content-wrapper',
    '[class.tri-tree-node-content-wrapper-open]': 'isExpanded',
    '[class.tri-tree-node-selected]': 'selected()'
  }
})
export class TriTreeNodeOptionComponent<T> implements OnInit {
  readonly selected = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly click = output<MouseEvent>();

  private readonly ngZone = inject(NgZone);
  private readonly element: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private readonly treeNode = inject(TriTreeNodeComponent<T>);

  get isExpanded(): boolean {
    return this.treeNode.isExpanded;
  }

  constructor() {
    effect(() => {
      if (this.selected()) {
        this.treeNode.select();
      } else {
        this.treeNode.deselect();
      }
    });

    effect(() => {
      if (this.disabled()) {
        this.treeNode.disable();
      } else {
        this.treeNode.enable();
      }
    });
  }

  ngOnInit(): void {
    fromEventOutsideAngular<MouseEvent>(this.element, 'click')
      .pipe(
        filter(() => !this.disabled()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.ngZone.run(() => this.click.emit(event));
      });
  }
}
