/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { TriOutletModule } from 'ng-zorro-antd/core/outlet';

import { TimelineService } from './timeline.service';
import { TriTimelineItemColor, TriTimelinePosition, TimelineTimeDefaultColors } from './typings';

function isDefaultColor(color?: string): boolean {
  return TimelineTimeDefaultColors.findIndex(i => i === color) !== -1;
}

@Component({
  selector: 'tri-timeline-item,[tri-timeline-item]',
  exportAs: 'triTimelineItem',
  template: `
    <ng-template #template>
      <li
        class="tri-timeline-item"
        [class.tri-timeline-item-right]="(position || position) === 'right'"
        [class.tri-timeline-item-left]="(position || position) === 'left'"
        [class.tri-timeline-item-last]="isLast"
      >
        @if (label) {
          <div class="tri-timeline-item-label">
            <ng-container *stringTemplateOutlet="label">{{ label }}</ng-container>
          </div>
        }
        <div class="tri-timeline-item-tail"></div>
        <div
          class="tri-timeline-item-head"
          [class.tri-timeline-item-head-red]="color === 'red'"
          [class.tri-timeline-item-head-blue]="color === 'blue'"
          [class.tri-timeline-item-head-green]="color === 'green'"
          [class.tri-timeline-item-head-gray]="color === 'gray'"
          [class.tri-timeline-item-head-custom]="!!dot"
          [style.border-color]="borderColor"
        >
          <ng-container *stringTemplateOutlet="dot">{{ dot }}</ng-container>
        </div>
        <div class="tri-timeline-item-content">
          <ng-content />
        </div>
      </li>
    </ng-template>
  `,
  imports: [TriOutletModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TriTimelineItemComponent implements OnChanges {
  private cdr = inject(ChangeDetectorRef);
  private timelineService = inject(TimelineService);

  @ViewChild('template', { static: false }) template!: TemplateRef<void>;

  @Input() position?: TriTimelinePosition;
  @Input() color: TriTimelineItemColor = 'blue';
  @Input() dot?: string | TemplateRef<void>;
  @Input() label?: string | TemplateRef<void>;

  isLast = false;
  borderColor: string | null = null;
  _position?: TriTimelinePosition;

  ngOnChanges(changes: SimpleChanges): void {
    this.timelineService.markForCheck();
    const { nzColor } = changes;
    if (nzColor) {
      this.updateCustomColor();
    }
  }

  detectChanges(): void {
    this.cdr.detectChanges();
  }

  private updateCustomColor(): void {
    this.borderColor = isDefaultColor(this.color) ? null : this.color;
  }
}
