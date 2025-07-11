/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  booleanAttribute,
  inject,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';

import { TriTreeNodeComponent } from './node';

@Component({
  selector: 'tri-tree-node-option',
  template: `<span class="tri-tree-title"><ng-content></ng-content></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tri-tree-node-content-wrapper',
    '[class.tri-tree-node-content-wrapper-open]': 'isExpanded',
    '[class.tri-tree-node-selected]': 'selected'
  }
})
export class TriTreeNodeOptionComponent<T> implements OnChanges, OnInit {
  private ngZone = inject(NgZone);
  private el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private destroyRef = inject(DestroyRef);
  private treeNode = inject(TriTreeNodeComponent<T>);

  @Input({ transform: booleanAttribute }) selected = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() readonly click = new EventEmitter<MouseEvent>();

  get isExpanded(): boolean {
    return this.treeNode.isExpanded;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzDisabled, nzSelected } = changes;
    if (nzDisabled) {
      if (nzDisabled.currentValue) {
        this.treeNode.disable();
      } else {
        this.treeNode.enable();
      }
    }

    if (nzSelected) {
      if (nzSelected.currentValue) {
        this.treeNode.select();
      } else {
        this.treeNode.deselect();
      }
    }
  }

  ngOnInit(): void {
    fromEventOutsideAngular<MouseEvent>(this.el, 'click')
      .pipe(
        filter(() => !this.disabled && this.click.observers.length > 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        this.ngZone.run(() => this.click.emit(event));
      });
  }
}
