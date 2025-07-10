/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { TriIconModule } from 'ng-zorro-antd/icon';

import { TriSegmentedService } from './segmented.service';

@Component({
  selector: '',
  exportAs: 'triSegmentedItem',
  imports: [TriIconModule, NgTemplateOutlet],
  template: `
    <input class="tri-segmented-item-input" type="radio" [checked]="isChecked" (click)="$event.stopPropagation()" />
    <div class="tri-segmented-item-label">
      @if (icon) {
        <span class="tri-segmented-item-icon"><tri-icon [type]="icon" /></span>
        <span>
          <ng-template [ngTemplateOutlet]="content" />
        </span>
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
    '[class.tri-segmented-item-selected]': 'isChecked',
    '[class.tri-segmented-item-disabled]': 'disabled || parentDisabled()',
    '(click)': 'handleClick()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriSegmentedItemComponent implements OnInit {
  private readonly service = inject(TriSegmentedService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  @Input() icon?: string;
  @Input() value!: string | number;
  @Input() disabled?: boolean;

  protected isChecked = false;
  readonly parentDisabled = toSignal(this.service.disabled$, { initialValue: false });

  ngOnInit(): void {
    this.service.selected$
      .pipe(
        tap(value => {
          this.isChecked = false;
          this.cdr.markForCheck();
          if (value === this.value) {
            this.service.activated$.next(this.elementRef.nativeElement);
          }
        }),
        switchMap(value =>
          this.service.animationDone$.pipe(
            filter(event => event.toState === 'to'),
            take(1),
            map(() => value)
          )
        ),
        filter(value => value === this.value),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.isChecked = true;
        this.cdr.markForCheck();
      });
  }

  handleClick(): void {
    if (!this.disabled && !this.parentDisabled()) {
      this.service.selected$.next(this.value);
      this.service.change$.next(this.value);
    }
  }
}
