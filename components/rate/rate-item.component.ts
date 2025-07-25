/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation,
  booleanAttribute
} from '@angular/core';

import { TriIconModule } from 'ng-zorro-antd/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: '[tri-rate-item]',
  exportAs: 'triRateItem',
  template: `
    <div
      class="tri-rate-star-second"
      (mouseover)="hoverRate(false); $event.stopPropagation()"
      (click)="clickRate(false)"
    >
      <ng-template
        [ngTemplateOutlet]="character || defaultCharacter"
        [ngTemplateOutletContext]="{ $implicit: index }"
      ></ng-template>
    </div>
    <div class="tri-rate-star-first" (mouseover)="hoverRate(true); $event.stopPropagation()" (click)="clickRate(true)">
      <ng-template
        [ngTemplateOutlet]="character || defaultCharacter"
        [ngTemplateOutletContext]="{ $implicit: index }"
      ></ng-template>
    </div>

    <ng-template #defaultCharacter>
      <tri-icon type="star" theme="fill" />
    </ng-template>
  `,
  imports: [NgTemplateOutlet, TriIconModule]
})
export class TriRateItemComponent {
  @Input() character!: TemplateRef<{ $implicit: number }>;
  @Input() index = 0;
  @Input({ transform: booleanAttribute }) allowHalf: boolean = false;
  @Output() readonly itemHover = new EventEmitter<boolean>();
  @Output() readonly itemClick = new EventEmitter<boolean>();

  hoverRate(isHalf: boolean): void {
    this.itemHover.next(isHalf && this.allowHalf);
  }

  clickRate(isHalf: boolean): void {
    this.itemClick.next(isHalf && this.allowHalf);
  }
}
