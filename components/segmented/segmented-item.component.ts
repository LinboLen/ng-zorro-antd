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
  inject,
  input,
  OnInit,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriSegmentedService } from './segmented.service';

@Component({
  selector: 'label[nz-segmented-item],label[nzSegmentedItem]',
  exportAs: 'triSegmentedItem',
  imports: [TriIconModule, NgTemplateOutlet],
  template: `
    <input class="tri-segmented-item-input" type="radio" [checked]="isChecked()" (click)="$event.stopPropagation()" />
    <div class="tri-segmented-item-label" [attr.aria-selected]="isChecked()">
      @if (icon(); as icon) {
        <span class="tri-segmented-item-icon">
          <tri-icon [type]="icon" />
        </span>
        <span *ngTemplateOutlet="content"></span>
      } @else {
        <ng-template [ngTemplateOutlet]="content" />
      }
    </div>

    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    class: 'tri-segmented-item',
    '[class.tri-segmented-item-selected]': 'isChecked()',
    '[class.tri-segmented-item-disabled]': 'disabled() || parentDisabled()',
    '(click)': 'handleClick()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriSegmentedItemComponent implements OnInit {
  private readonly service = inject(TriSegmentedService);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  value = input.required<string | number>();
  icon = input<string>();
  disabled = input(false, { transform: booleanAttribute });

  protected readonly isChecked = signal(false);
  readonly parentDisabled = toSignal(this.service.disabled$, { initialValue: false });

  ngOnInit(): void {
    this.service.selected$
      .pipe(
        tap(value => {
          this.isChecked.set(false);
          if (value === this.value()) {
            this.service.activated$.next(this.elementRef.nativeElement);
          }
        }),
        switchMap(value =>
          this.service.animationDone$.pipe(
            filter(event => event.toState === 'to' || event.toState === 'toVertical'),
            take(1),
            map(() => value)
          )
        ),
        filter(value => value === this.value()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.isChecked.set(true));
  }

  handleClick(): void {
    if (!this.disabled() && !this.parentDisabled()) {
      this.service.selected$.next(this.value());
      this.service.change$.next(this.value());
    }
  }
}
