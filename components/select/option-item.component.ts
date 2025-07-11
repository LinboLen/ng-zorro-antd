/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TriSafeAny } from 'ng-zorro-antd/core/types';
import { fromEventOutsideAngular } from 'ng-zorro-antd/core/util';
import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'tri-option-item',
  template: `
    <div class="tri-select-item-option-content">
      @if (customContent) {
        <ng-template [ngTemplateOutlet]="template"></ng-template>
      } @else {
        {{ label }}
      }
    </div>
    @if (showState && selected) {
      <div class="tri-select-item-option-state" unselectable="on">
        @if (!icon) {
          <tri-icon type="check" class="tri-select-selected-icon" />
        } @else {
          <ng-template [ngTemplateOutlet]="icon"></ng-template>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'tri-select-item ant-select-item-option',
    '[attr.title]': 'title',
    '[class.tri-select-item-option-grouped]': 'grouped',
    '[class.tri-select-item-option-selected]': 'selected && !disabled',
    '[class.tri-select-item-option-disabled]': 'disabled',
    '[class.tri-select-item-option-active]': 'activated && !disabled'
  },
  imports: [NgTemplateOutlet, TriIconModule]
})
export class TriOptionItemComponent implements OnChanges, OnInit {
  private readonly el: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  selected = false;
  activated = false;
  @Input() grouped = false;
  @Input({ transform: booleanAttribute }) customContent = false;
  @Input() template: TemplateRef<TriSafeAny> | null = null;
  @Input() disabled = false;
  @Input() showState = false;
  @Input() title?: string | number | null;
  @Input() label: string | number | null = null;
  @Input() value: TriSafeAny | null = null;
  @Input() activatedValue: TriSafeAny | null = null;
  @Input() listOfSelectedValue: TriSafeAny[] = [];
  @Input() icon: TemplateRef<TriSafeAny> | null = null;
  @Input() compareWith!: (o1: TriSafeAny, o2: TriSafeAny) => boolean;
  @Output() readonly itemClick = new EventEmitter<TriSafeAny>();
  @Output() readonly itemHover = new EventEmitter<TriSafeAny>();

  ngOnChanges(changes: SimpleChanges): void {
    const { value, activatedValue, listOfSelectedValue } = changes;
    if (value || listOfSelectedValue) {
      this.selected = this.listOfSelectedValue.some(v => this.compareWith(v, this.value));
    }
    if (value || activatedValue) {
      this.activated = this.compareWith(this.activatedValue, this.value);
    }
  }

  ngOnInit(): void {
    fromEventOutsideAngular(this.el, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.disabled) {
          this.ngZone.run(() => this.itemClick.emit(this.value));
        }
      });

    fromEventOutsideAngular(this.el, 'mouseenter')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.disabled) {
          this.ngZone.run(() => this.itemHover.emit(this.value));
        }
      });
  }
}
